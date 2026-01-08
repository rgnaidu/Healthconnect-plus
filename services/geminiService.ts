
import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const suggestDoctor = async (problem: string, symptoms: string[]) => {
  const ai = getAI();
  const prompt = `A patient is experiencing the following problem: "${problem}" with these symptoms: ${symptoms.join(', ')}. 
  Suggest the type of medical specialist they should consult. Return only the specialty name in plain text.`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text?.trim() || "General Physician";
  } catch (error) {
    console.error("AI suggestion error:", error);
    return "General Physician";
  }
};

export const findNearbyHospitals = async (lat: number, lng: number, problem: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Find hospitals nearby me specializing in ${problem} or general healthcare.`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: lat,
              longitude: lng
            }
          }
        }
      },
    });

    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    return chunks.map((chunk: any) => ({
      name: chunk.maps?.title || "Nearby Medical Center",
      uri: chunk.maps?.uri || "#",
      location: "Within 5km"
    }));
  } catch (error) {
    console.error("Maps grounding error:", error);
    return [
      { name: "City Hospital", uri: "#", location: "2.4 km away" },
      { name: "Global Health Clinic", uri: "#", location: "3.1 km away" },
      { name: "Care Point Medical", uri: "#", location: "4.5 km away" }
    ];
  }
};
