
import React, { useState, useEffect } from 'react';
import { User, SavedKit } from '../types';
import { LogoutIcon } from './icons/LogoutIcon';
import { EditIcon } from './icons/EditIcon';
import { PlusIcon } from './icons/PlusIcon';

interface ProfileProps {
  user: User;
  onLogout: () => void;
  getArtisanKits: (artisanId: string) => SavedKit[];
  onSelectKit: (kitId: string) => void;
  onUpdateUser: (user: User) => void;
  onCreateNew: () => void;
}

const ProfileDetailItem: React.FC<{ label: string; value?: string }> = ({ label, value }) => (
    <div className="flex justify-between items-center py-3 border-b border-stone-200">
        <span className="text-sm text-stone-500">{label}</span>
        <span className="text-sm font-medium text-stone-800">{value || '- not added -'}</span>
    </div>
);

export const Profile: React.FC<ProfileProps> = ({ user, onLogout, getArtisanKits, onSelectKit, onUpdateUser, onCreateNew }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<User>(user);

  useEffect(() => {
    setFormData(user);
  }, [user]);

  const isArtisan = user.role === 'artisan';
  const artisanKits = isArtisan ? getArtisanKits(user.id) : [];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser(formData);
    setIsEditing(false);
  };
  
  const handleCancelEdit = () => {
    setFormData(user); // Reset changes
    setIsEditing(false);
  };
  
  const renderViewMode = () => (
    <div className="bg-white p-6 rounded-lg shadow-md border border-stone-200">
        <h3 className="font-bold text-lg text-stone-700 mb-2">Profile Details</h3>
        <div className="space-y-1">
            <ProfileDetailItem label="Full Name" value={user.name} />
            <ProfileDetailItem label="Mobile Number" value={user.mobile} />
            <ProfileDetailItem label="Email ID" value={user.email} />
            <ProfileDetailItem label="Gender" value={user.gender} />
            <ProfileDetailItem label="Date of Birth" value={user.dob} />
            <ProfileDetailItem label="Location" value={user.location} />
        </div>
        <button 
            onClick={() => setIsEditing(true)}
            className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 text-white font-semibold rounded-lg shadow hover:bg-amber-700 transition"
        >
            <EditIcon className="w-4 h-4" />
            Edit Details
        </button>
    </div>
  );

  const renderEditMode = () => (
    <form onSubmit={handleSaveChanges} className="bg-white p-6 rounded-lg shadow-md border border-stone-200">
        <h3 className="font-bold text-lg text-stone-700 mb-4">Edit Profile Details</h3>
        <div className="space-y-4">
            {Object.entries({
                name: { label: 'Full Name', type: 'text' },
                mobile: { label: 'Mobile Number', type: 'tel' },
                email: { label: 'Email ID', type: 'email', disabled: true },
                gender: { label: 'Gender', type: 'select', options: ['', 'male', 'female', 'other'] },
                dob: { label: 'Date of Birth', type: 'date' },
                location: { label: 'Location', type: 'text' },
            }).map(([key, { label, type, disabled, options }]) => (
                <div key={key}>
                    <label htmlFor={key} className="block text-sm font-medium text-stone-600 mb-1">{label}</label>
                    {type === 'select' && options ? (
                        <select
                            id={key}
                            name={key}
                            value={formData[key as keyof User] as string || ''}
                            onChange={handleInputChange}
                            className="w-full p-2 border bg-white border-stone-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500"
                        >
                            {options.map(opt => <option key={opt} value={opt} className="capitalize">{opt || 'Select...'}</option>)}
                        </select>
                    ) : (
                        <input
                            type={type}
                            id={key}
                            name={key}
                            value={formData[key as keyof User] as string || ''}
                            onChange={handleInputChange}
                            disabled={disabled}
                            className="w-full p-2 border bg-white border-stone-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 disabled:bg-stone-100"
                        />
                    )}
                </div>
            ))}
        </div>
        <div className="mt-6 flex gap-4">
            <button type="submit" className="flex-1 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition">
                Save Changes
            </button>
            <button type="button" onClick={handleCancelEdit} className="flex-1 px-4 py-2 bg-stone-200 text-stone-700 font-semibold rounded-lg hover:bg-stone-300 transition">
                Cancel
            </button>
        </div>
    </form>
  );

  return (
    <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-8 border-b pb-4">
            <div>
                <h2 className="text-3xl font-bold text-stone-800">My Account</h2>
                <p className="text-stone-500">Welcome back, {user.name}!</p>
            </div>
            <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 bg-stone-200 text-stone-700 font-semibold rounded-lg hover:bg-stone-300 transition-colors"
            >
                <LogoutIcon className="w-5 h-5" />
                <span>Logout</span>
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
                {isEditing ? renderEditMode() : renderViewMode()}
            </div>
            <div className="md:col-span-2">
                {isArtisan ? (
                    <div className="bg-white p-6 rounded-lg shadow-md border border-stone-200">
                        <div className="flex justify-between items-center border-b pb-2 mb-4">
                            <h3 className="font-bold text-lg text-stone-700">My Products</h3>
                            <button
                                onClick={onCreateNew}
                                className="inline-flex items-center justify-center gap-2 px-3 py-1.5 text-sm bg-amber-600 text-white font-bold rounded-lg shadow hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-300 transition-all"
                            >
                                <PlusIcon className="w-4 h-4" />
                                Add Product
                            </button>
                        </div>
                        {artisanKits.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {artisanKits.map(kit => (
                                    <button
                                        key={kit.id}
                                        onClick={() => onSelectKit(kit.id)}
                                        className="group block bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 border border-stone-200 overflow-hidden text-left"
                                    >
                                        <div className="w-full h-32 overflow-hidden">
                                            <img
                                                src={kit.userInput.imageFile}
                                                alt={kit.generatedAssets.english.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                        <div className="p-3">
                                            <p className="font-semibold text-sm text-stone-700 truncate group-hover:text-amber-600 transition-colors">
                                                {kit.generatedAssets.english.title}
                                            </p>
                                            <p className="text-md font-bold text-stone-800 mt-1">
                                                {`₹${kit.userInput.price.toFixed(2)}`}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-stone-500 py-8">You have not uploaded any products yet.</p>
                        )}
                    </div>
                ) : (
                    <div className="bg-white p-6 rounded-lg shadow-md border border-stone-200 text-center">
                         <h3 className="font-bold text-lg text-stone-700 mb-2">My Orders</h3>
                         <p className="text-stone-500">Order history functionality is coming soon!</p>
                    </div>
                 )}
            </div>
        </div>
    </div>
  );
};
