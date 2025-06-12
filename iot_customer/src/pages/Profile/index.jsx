import {useEffect, useState} from 'react';
import {Calendar, CheckCircle, DollarSign, Edit, Mail, Shield, User, X} from 'lucide-react';
import {fetchData} from "../../api/fetchData.js";
import {putRequest} from "../../api/index.js";
import {toast} from "react-toastify";

export default function ProfilePage() {
    const [userData, setUserData] = useState({
        user_id: 0,
        username: "",
        email: "",
        role: "",
        first_name: "",
        last_name: "",
        balance: 0,
        created_at: "",
        updated_at: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        first_name: '',
        last_name: '',
        email: ''
    });

    // Format date to be more readable
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Initialize form data when user data is loaded
    useEffect(() => {
        if (userData) {
            setEditForm({
                first_name: userData.first_name || '',
                last_name: userData.last_name || '',
                email: userData.email || ''
            });
        }
    }, [userData]);

    const handleEditToggle = () => {
        if (isEditing) {
            // Reset form when canceling
            setEditForm({
                first_name: userData.first_name || '',
                last_name: userData.last_name || '',
                email: userData.email || ''
            });
        }
        setIsEditing(!isEditing);
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setEditForm({
            ...editForm,
            [name]: value
        });
    };

    const handleSubmit = async () => {
        try {
            setIsLoading(true); // Show loading state
            const response = await putRequest('/user/update', editForm);
            if (response.code === 200) {
                const updatedUser = response.info;
                setUserData({
                    ...userData,
                    ...updatedUser,
                });
                setIsEditing(false);
            } else {
                toast.error('Failed to update user information');
            }
        } catch (error) {
            toast.error('Error updating user information:', error);
            console.error('Error updating user information:', error);
        } finally {
            setIsLoading(false); // Hide loading state
        }
    };

    // Fetch user data on component mount
    useEffect(() => {
        void fetchData('/user/profile', setUserData, null, null);
    }, []);

    // Show loading state
    if (isLoading) {
        return (
            <main className="flex-grow">
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <div className="animate-pulse flex flex-col items-center">
                        <div className="rounded-full bg-gray-200 h-24 w-24 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    </div>
                    <p className="mt-4 text-gray-500">Loading profile...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="flex-grow">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Profile Header */}
                <div className="bg-blue-600 text-white p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="bg-blue-800 rounded-full p-3">
                                <User size={32}/>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">{userData.first_name} {userData.last_name}</h2>
                                <p className="flex items-center">
                                    <Shield size={16} className="mr-1"/>
                                    <span className="capitalize">{userData.role}</span>
                                </p>
                            </div>
                        </div>
                        {!isEditing && (
                            <button
                                onClick={handleEditToggle}
                                className="flex items-center bg-white text-blue-700 px-4 py-2 rounded font-medium hover:bg-blue-50"
                            >
                                <Edit size={16} className="mr-2"/>
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>

                {/* Profile Content */}
                <div className="p-6">
                    {isEditing ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                    <input
                                        type="text"
                                        name="first_name"
                                        value={editForm.first_name}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                    <input
                                        type="text"
                                        name="last_name"
                                        value={editForm.last_name}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={editForm.email}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex space-x-4 pt-4">
                                <button
                                    onClick={handleSubmit}
                                    className="flex items-center bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700"
                                >
                                    <CheckCircle size={16} className="mr-2"/>
                                    Save Changes
                                </button>
                                <button
                                    onClick={handleEditToggle}
                                    className="flex items-center bg-gray-200 text-gray-700 px-4 py-2 rounded font-medium hover:bg-gray-300"
                                >
                                    <X size={16} className="mr-2"/>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* User Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Account
                                        Information</h3>

                                    <div className="space-y-3">
                                        <div className="flex items-start">
                                            <User className="text-blue-600 mt-1 mr-3" size={20}/>
                                            <div>
                                                <p className="text-sm text-gray-500">Username</p>
                                                <p className="font-medium">{userData.username}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <Mail className="text-blue-600 mt-1 mr-3" size={20}/>
                                            <div>
                                                <p className="text-sm text-gray-500">Email</p>
                                                <p className="font-medium">{userData.email}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <Shield className="text-blue-600 mt-1 mr-3" size={20}/>
                                            <div>
                                                <p className="text-sm text-gray-500">Role</p>
                                                <p className="font-medium capitalize">{userData.role}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Account Details */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Account
                                        Details</h3>

                                    <div className="space-y-3">
                                        <div className="flex items-start">
                                            <DollarSign className="text-blue-600 mt-1 mr-3" size={20}/>
                                            <div>
                                                <p className="text-sm text-gray-500">Balance</p>
                                                <p className="font-medium">${userData.balance.toFixed(2)}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <Calendar className="text-blue-600 mt-1 mr-3" size={20}/>
                                            <div>
                                                <p className="text-sm text-gray-500">Member Since</p>
                                                <p className="font-medium">{formatDate(userData.created_at)}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <Calendar className="text-blue-600 mt-1 mr-3" size={20}/>
                                            <div>
                                                <p className="text-sm text-gray-500">Last Updated</p>
                                                <p className="font-medium">{formatDate(userData.updated_at)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}