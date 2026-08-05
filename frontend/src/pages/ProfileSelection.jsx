import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, DEFAULT_AVATARS } from '../context/AuthContext';
import { Plus, Check, Edit2 } from 'lucide-react';

const ProfileSelection = () => {
  const { profiles, setSelectedProfile, addProfile } = useAuth();
  const [isAddingProfile, setIsAddingProfile] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(DEFAULT_AVATARS[0]);
  const navigate = useNavigate();

  const handleSelectProfile = (profile) => {
    setSelectedProfile(profile);
    navigate('/browse');
  };

  const handleAddProfileSubmit = (e) => {
    e.preventDefault();
    if (newProfileName.trim()) {
      addProfile(newProfileName.trim(), selectedAvatar);
      setNewProfileName('');
      setIsAddingProfile(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white flex flex-col items-center justify-center p-4 selection:bg-red-600">
      <div className="max-w-4xl w-full text-center space-y-8 animate-fade-in">
        
        {/* Title */}
        <h1 className="text-3xl md:text-5xl font-medium tracking-tight text-gray-100 drop-shadow">
          Who's watching?
        </h1>

        {/* Profile Grid */}
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 pt-4">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              onClick={() => handleSelectProfile(profile)}
              className="group cursor-pointer flex flex-col items-center space-y-3"
            >
              <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-md overflow-hidden border-2 border-transparent group-hover:border-white transition-all duration-200 shadow-xl group-hover:scale-105">
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-full h-full object-cover group-hover:brightness-110 transition"
                />
              </div>
              <span className="text-sm md:text-base text-gray-400 group-hover:text-white transition font-medium">
                {profile.name}
              </span>
            </div>
          ))}

          {/* Add Profile Button */}
          <div
            onClick={() => setIsAddingProfile(true)}
            className="group cursor-pointer flex flex-col items-center space-y-3"
          >
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-md border-2 border-gray-600 border-dashed group-hover:border-gray-300 flex items-center justify-center transition group-hover:scale-105 bg-gray-900/40">
              <Plus className="w-12 h-12 text-gray-500 group-hover:text-gray-200 transition" />
            </div>
            <span className="text-sm md:text-base text-gray-500 group-hover:text-gray-200 transition font-medium">
              Add Profile
            </span>
          </div>
        </div>

        {/* Manage Profiles Footer Button */}
        <div className="pt-8">
          <button
            onClick={() => setIsAddingProfile(true)}
            className="border border-gray-600 text-gray-400 hover:text-white hover:border-white px-6 py-2 tracking-widest text-sm uppercase transition cursor-pointer"
          >
            Manage Profiles
          </button>
        </div>
      </div>

      {/* Add Profile Modal */}
      {isAddingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#181818] border border-gray-800 rounded-xl p-6 shadow-2xl space-y-6">
            <h2 className="text-2xl font-bold text-white">Add Profile</h2>

            <form onSubmit={handleAddProfileSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Profile Name</label>
                <input
                  type="text"
                  placeholder="Enter name"
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Choose Avatar</label>
                <div className="flex items-center space-x-3">
                  {DEFAULT_AVATARS.map((av, idx) => (
                    <img
                      key={idx}
                      src={av}
                      alt="Avatar choice"
                      onClick={() => setSelectedAvatar(av)}
                      className={`w-12 h-12 rounded cursor-pointer border-2 transition ${
                        selectedAvatar === av ? 'border-red-600 scale-110' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddingProfile(false)}
                  className="px-4 py-2 border border-gray-600 text-gray-300 hover:text-white rounded text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded text-sm transition cursor-pointer"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSelection;
