
import React from 'react';
import { Page } from '../../types';
import { Video, MapPin, Pill, Clock } from 'lucide-react';

interface HomeProps {
  setActivePage: (p: Page) => void;
}

const Home: React.FC<HomeProps> = ({ setActivePage }) => {
  const actions = [
    {
      title: 'Virtual Appointment',
      desc: 'Connect with specialists via HD video call.',
      icon: <Video className="text-blue-600" size={32} />,
      color: 'bg-blue-50',
      action: () => setActivePage('doctors')
    },
    {
      title: 'Offline Appointment',
      desc: 'Find hospitals nearby and book physical visits.',
      icon: <MapPin className="text-emerald-600" size={32} />,
      color: 'bg-emerald-50',
      action: () => setActivePage('doctors')
    },
    {
      title: 'Medicine Booking',
      desc: 'Order medicines and get doorstep delivery.',
      icon: <Pill className="text-orange-600" size={32} />,
      color: 'bg-orange-50',
      action: () => setActivePage('medicines')
    },
    {
      title: 'Medical History',
      desc: 'View your previous reports and prescriptions.',
      icon: <Clock className="text-purple-600" size={32} />,
      color: 'bg-purple-50',
      action: () => setActivePage('lab-reports')
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="relative overflow-hidden rounded-3xl bg-teal-600 p-8 md:p-12 text-white">
        <div className="relative z-10 max-w-lg">
          <h3 className="text-3xl font-bold mb-4">Your Health, Our Priority.</h3>
          <p className="text-teal-100 text-lg mb-6">
            Access world-class healthcare from the comfort of your home. Consult with doctors, order medicines, and manage your health records seamlessly.
          </p>
          <button 
            onClick={() => setActivePage('doctors')}
            className="bg-white text-teal-700 px-6 py-3 rounded-xl font-bold hover:bg-teal-50 transition-colors shadow-lg"
          >
            Start Consultation
          </button>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-20 hidden md:block">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#FFFFFF" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-46.2C87.4,-33.3,90.1,-17.6,88.4,-2.4C86.7,12.7,80.7,27.3,71.5,39.6C62.3,51.9,49.9,61.9,36.5,69.5C23.1,77.1,8.7,82.3,-5.7,82.1C-20.1,81.9,-34.5,76.3,-47.5,68.2C-60.5,60.1,-72.1,49.5,-79.1,36.4C-86.1,23.3,-88.5,7.7,-86.3,-7.4C-84.1,-22.5,-77.3,-37.1,-67.2,-48.9C-57.1,-60.7,-43.7,-69.7,-29.9,-76.8C-16.1,-83.9,-2,-89.1,12.6,-88.1C27.2,-87.1,44.7,-76.4,44.7,-76.4Z" transform="translate(100 100)" />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {actions.map((item, idx) => (
          <button
            key={idx}
            onClick={item.action}
            className="flex flex-col text-left p-6 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-teal-200 transition-all group"
          >
            <div className={`p-4 rounded-2xl w-fit mb-4 ${item.color} group-hover:scale-110 transition-transform`}>
              {item.icon}
            </div>
            <h4 className="font-bold text-slate-800 mb-2">{item.title}</h4>
            <p className="text-sm text-slate-500">{item.desc}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
          <h4 className="font-bold text-slate-800 mb-6 flex items-center justify-between">
            Upcoming Appointments
            <button className="text-teal-600 text-sm hover:underline">See all</button>
          </h4>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex flex-col items-center justify-center text-xs">
                <span className="font-bold text-base">24</span>
                <span>OCT</span>
              </div>
              <div className="flex-1">
                <h5 className="font-semibold text-slate-800 text-sm">Dr. Sarah Wilson</h5>
                <p className="text-xs text-slate-500">Virtual Consultation • 10:30 AM</p>
              </div>
              <span className="px-3 py-1 bg-teal-100 text-teal-700 text-xs font-bold rounded-full">Confirmed</span>
            </div>
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-slate-200 text-slate-600 flex flex-col items-center justify-center text-xs">
                <span className="font-bold text-base">28</span>
                <span>OCT</span>
              </div>
              <div className="flex-1">
                <h5 className="font-semibold text-slate-800 text-sm">Apollo Clinic - Orthopedic</h5>
                <p className="text-xs text-slate-500">Offline Visit • 04:00 PM</p>
              </div>
              <span className="px-3 py-1 bg-slate-200 text-slate-600 text-xs font-bold rounded-full">Pending</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
          <h4 className="font-bold mb-4 relative z-10">Health Tip of the Day</h4>
          <p className="text-indigo-100 text-sm mb-6 relative z-10">
            "Drinking a glass of water first thing in the morning helps kickstart your metabolism and flush out toxins."
          </p>
          <button className="bg-indigo-400/30 hover:bg-indigo-400/50 text-white px-4 py-2 rounded-xl text-sm transition-all relative z-10">
            Learn More
          </button>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-2xl"></div>
        </div>
      </div>
    </div>
  );
};

export default Home;
