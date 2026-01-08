
import React, { useState } from 'react';
import { MOCK_MEDICINES } from '../../constants';
import { ShoppingCart, Search, Filter, Plus, Minus, Check } from 'lucide-react';

const Medicines: React.FC = () => {
  const [cart, setCart] = useState<{ id: string, qty: number }[]>([]);
  const [search, setSearch] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);

  const filteredMeds = MOCK_MEDICINES.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  const updateCart = (id: string, delta: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === id);
      if (existing) {
        const newQty = existing.qty + delta;
        if (newQty <= 0) return prev.filter(item => item.id !== id);
        return prev.map(item => item.id === id ? { ...item, qty: newQty } : item);
      }
      if (delta > 0) return [...prev, { id, qty: 1 }];
      return prev;
    });
  };

  const cartTotal = cart.reduce((total, item) => {
    const med = MOCK_MEDICINES.find(m => m.id === item.id);
    return total + (med ? med.price * item.qty : 0);
  }, 0);

  const handleCheckout = () => {
    setOrderPlaced(true);
    setTimeout(() => {
      setOrderPlaced(false);
      setCart([]);
    }, 3000);
  };

  if (orderPlaced) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-in zoom-in duration-300">
        <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-6">
          <Check size={48} />
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Order Placed Successfully!</h3>
        <p className="text-slate-500">Your medicines will be delivered within 30 minutes.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Search and Catalog */}
      <div className="lg:col-span-3 space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search medicines, health drinks, supplements..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="px-6 py-3 bg-white border border-slate-200 rounded-2xl flex items-center gap-2 text-slate-600 hover:border-teal-300">
            <Filter size={18} /> Filters
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredMeds.map(med => {
            const cartItem = cart.find(item => item.id === med.id);
            return (
              <div key={med.id} className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                <div className="relative h-48 bg-slate-100">
                  <img src={med.image} alt={med.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <span className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-600 border">
                    {med.category}
                  </span>
                </div>
                <div className="p-6">
                  <h5 className="font-bold text-slate-800 mb-1">{med.name}</h5>
                  <p className="text-xs text-slate-400 mb-4 h-8 overflow-hidden">{med.description}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-teal-700">₹{med.price}</p>
                    
                    {cartItem ? (
                      <div className="flex items-center gap-3 bg-slate-50 border rounded-xl px-2 py-1">
                        <button onClick={() => updateCart(med.id, -1)} className="p-1 hover:text-teal-600 transition-colors">
                          <Minus size={16} />
                        </button>
                        <span className="font-bold text-slate-700 min-w-[20px] text-center">{cartItem.qty}</span>
                        <button onClick={() => updateCart(med.id, 1)} className="p-1 hover:text-teal-600 transition-colors">
                          <Plus size={16} />
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => updateCart(med.id, 1)}
                        className="bg-teal-600 hover:bg-teal-700 text-white p-2 px-4 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors"
                      >
                        Add
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sticky top-8">
          <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <ShoppingCart size={20} className="text-teal-600" />
            Your Cart
          </h4>

          {cart.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart size={32} />
              </div>
              <p className="text-slate-400 text-sm">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                {cart.map(item => {
                  const med = MOCK_MEDICINES.find(m => m.id === item.id);
                  if (!med) return null;
                  return (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <div className="flex-1">
                        <p className="font-semibold text-slate-700">{med.name}</p>
                        <p className="text-xs text-slate-400">Qty: {item.qty}</p>
                      </div>
                      <p className="font-bold text-slate-700">₹{med.price * item.qty}</p>
                    </div>
                  );
                })}
              </div>

              <div className="border-t pt-4 space-y-4">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span>₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Delivery Fee</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t text-lg font-bold text-slate-800">
                  <span>Total</span>
                  <span className="text-teal-700">₹{cartTotal}</span>
                </div>
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-teal-100 transition-all transform active:scale-95"
                >
                  Checkout Now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Medicines;
