import React, { useState } from 'react';
import toast from 'react-hot-toast';

const Profile = () => {
  const initialUser = JSON.parse(localStorage.getItem('user')) || { name: '', email: '', avatar: '' };
  
  const [name, setName] = useState(initialUser.name || '');
  const [email, setEmail] = useState(initialUser.email || '');
  const [avatar, setAvatar] = useState(initialUser.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Devika'); 
  const [password, setPassword] = useState(''); 
  const [isSaving, setIsSaving] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    setTimeout(() => {
      const updatedUser = { ...initialUser, name, email, avatar };
  
      if (password) {
        updatedUser.password = password; 
        toast.success('Profile & Password updated successfully! 🔒✨');
      } else {
        toast.success('Profile updated successfully! ✨');
      }

      localStorage.setItem('user', JSON.stringify(updatedUser));
      setIsSaving(false);
      setPassword(''); 
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-6"> My Profile</h2>
      
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 backdrop-blur-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="relative group">
            <img 
              src={avatar} 
              alt="Profile" 
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-500/30 shadow-xl" 
            />
            <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer transition shadow-lg">
              📷
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          </div>
          <h3 className="text-xl font-semibold text-white mt-4">{name || 'Your Name'}</h3>
          <p className="text-slate-400 text-sm">{email || 'your.email@example.com'}</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Full Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white outline-none transition"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white outline-none transition"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              New Password <span className="text-xs text-slate-500">(Leave blank to keep current)</span>
            </label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white outline-none transition"
              placeholder="Enter new password to change it"
            />
          </div>

          <div className="flex justify-end pt-4">
            <button 
              type="submit" 
              disabled={isSaving}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transition disabled:opacity-50 flex items-center gap-2"
            >
              {isSaving ? 'Saving...' : '💾 Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;