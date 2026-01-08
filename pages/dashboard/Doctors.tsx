
import React, { useState } from 'react';
import { MOCK_DOCTORS } from '../../constants';
import { suggestDoctor, findNearbyHospitals } from '../../services/geminiService';
import { Video, MapPin, CheckCircle, Search, Star, Loader2, Calendar } from 'lucide-react';
import { Doctor } from '../../types';

const Doctors: React.FC = () => {
  const [bookingType, setBookingType] = useState<'virtual' | 'offline' | null>(null);
  const [problem, setProblem] = useState('');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [step, setStep] = useState(1);
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [aiSpecialist, setAiSpecialist] = useState('');
  const [nearbyHospitals, setNearbyHospitals] = useState<any[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [bookingStatus, setBookingStatus] = useState<'none' | 'processing' | 'success'>('none');

  const availableSymptoms = [
    'Fever', 'Headache', 'Cough', 'Body Pain', 'Nausea', 'Skin Rash', 'Fatigue', 'Dizziness'
  ];

  const handleSymptomToggle = (s: string) => {
    setSymptoms(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const startAnalysis = async () => {
    if (!problem || symptoms.length === 0) {
      alert("Please provide problem and symptoms");
      return;
    }
    
    setIsAIProcessing(true);
    if (bookingType === 'virtual') {
      const specialist = await suggestDoctor(problem, symptoms);
      setAiSpecialist(specialist);
      setStep(3);
    } else {
      // Offline Flow
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (pos) => {
          const hospitals = await findNearbyHospitals(pos.coords.latitude, pos.coords.longitude, problem);
          setNearbyHospitals(hospitals);
          setStep(3);
          setIsAIProcessing(false);
        }, () => {
          alert("Location permission denied. Showing defaults.");
          setNearbyHospitals([
            { name: "City Hospital", uri: "#", location: "2.4 km away" },
            { name: "Global Health Clinic", uri: "#", location: "3.1 km away" }
          ]);
          setStep(3);
          setIsAIProcessing(false);
        });
      }
    }
    setIsAIProcessing(false);
  };

  const confirmBooking = (docOrHosp: any) => {
    setBookingStatus('processing');
    setTimeout(() => {
      setBookingStatus('success');
      // Simulate 30-min reminder
      setTimeout(() => {
        alert(`REMAINDER: Your appointment with ${docOrHosp.name} is in 30 minutes!`);
      }, 3000);
    }, 2000);
  };

  if (bookingStatus === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-in zoom-in duration-300">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle size={48} />
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Appointment Booked!</h3>
        <p className="text-slate-500 mb-8">You will receive a reminder 30 minutes before your scheduled time.</p>
        <button 
          onClick={() => {
            setBookingStatus('none');
            setBookingType(null);
            setStep(1);
          }}
          className="bg-teal-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-teal-700 transition-all"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {!bookingType ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <button 
            onClick={() => setBookingType('virtual')}
            className="group flex flex-col items-center p-12 bg-white rounded-3xl border border-slate-100 shadow-sm hover:border-blue-300 hover:shadow-xl transition-all"
          >
            <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Video size={36} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Virtual Appointment</h3>
            <p className="text-center text-slate-500 text-sm">Consult with top specialists from anywhere via video call.</p>
          </button>
          
          <button 
            onClick={() => setBookingType('offline')}
            className="group flex flex-col items-center p-12 bg-white rounded-3xl border border-slate-100 shadow-sm hover:border-emerald-300 hover:shadow-xl transition-all"
          >
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <MapPin size={36} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">In-Person Visit</h3>
            <p className="text-center text-slate-500 text-sm">Book physical appointments at hospitals near your location.</p>
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="bg-teal-600 p-6 text-white flex justify-between items-center">
            <h3 className="text-xl font-bold">
              {bookingType === 'virtual' ? 'Online Video Consultation' : 'Hospital Appointment'}
            </h3>
            <button 
              onClick={() => { setBookingType(null); setStep(1); }}
              className="text-teal-100 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <div className="p-8">
            {step === 1 && (
              <div className="space-y-6 animate-in slide-in-from-right duration-300">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">Briefly describe your health issue:</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Sharp pain in chest since morning"
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none"
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">Select symptoms you are experiencing:</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {availableSymptoms.map(s => (
                      <button
                        key={s}
                        onClick={() => handleSymptomToggle(s)}
                        className={`px-4 py-2 rounded-xl text-sm border transition-all ${
                          symptoms.includes(s) 
                            ? 'bg-teal-600 text-white border-teal-600' 
                            : 'bg-white text-slate-600 border-slate-200 hover:border-teal-300'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => setStep(2)}
                  disabled={!problem || symptoms.length === 0}
                  className="w-full py-4 bg-teal-600 text-white rounded-2xl font-bold disabled:opacity-50 hover:bg-teal-700 shadow-lg shadow-teal-100 transition-all"
                >
                  Continue to Suggestion
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="text-center space-y-8 animate-in slide-in-from-right duration-300">
                <div className="p-8 bg-slate-50 rounded-3xl border-2 border-dashed border-teal-200">
                  {isAIProcessing ? (
                    <div className="flex flex-col items-center">
                      <Loader2 className="animate-spin text-teal-600 mb-4" size={40} />
                      <p className="text-slate-600 font-medium italic">Our AI is analyzing your symptoms...</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto">
                        <Star />
                      </div>
                      <h4 className="text-xl font-bold text-slate-800">Ready for Selection</h4>
                      <p className="text-slate-500">Based on your description, we recommend consulting a specialist.</p>
                      <button 
                        onClick={startAnalysis}
                        className="bg-teal-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-teal-700"
                      >
                        Find Specialists
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-in slide-in-from-right duration-300">
                {bookingType === 'virtual' ? (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-slate-800">Recommended Doctors ({aiSpecialist})</h4>
                      <Search size={20} className="text-slate-400" />
                    </div>
                    <div className="space-y-4">
                      {MOCK_DOCTORS.map(doc => (
                        <div key={doc.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow">
                          <img src={doc.image} alt={doc.name} className="w-24 h-24 rounded-2xl object-cover shadow-sm" />
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                              <h5 className="font-bold text-slate-800">{doc.name}</h5>
                              <div className="flex items-center text-amber-500 text-sm font-bold">
                                <Star size={16} className="fill-current mr-1" /> {doc.rating}
                              </div>
                            </div>
                            <p className="text-sm text-teal-600 font-semibold">{doc.specialty}</p>
                            <p className="text-xs text-slate-500 leading-relaxed">{doc.education}</p>
                            <div className="flex flex-wrap gap-2 pt-2">
                              {doc.timings.map(t => (
                                <button 
                                  key={t}
                                  onClick={() => confirmBooking(doc)}
                                  className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs hover:bg-teal-50 hover:border-teal-300 transition-colors"
                                >
                                  {t}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <h4 className="font-bold text-slate-800">Nearby Hospitals for Your Condition</h4>
                    <div className="space-y-4">
                      {nearbyHospitals.map((hosp, i) => (
                        <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                              <MapPin />
                            </div>
                            <div>
                              <h5 className="font-bold text-slate-800">{hosp.name}</h5>
                              <p className="text-xs text-slate-500">{hosp.location}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => confirmBooking(hosp)}
                            className="bg-emerald-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors"
                          >
                            Book Slot
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Doctors;
