import { useState, useEffect } from "react";

import { useParams, useNavigate } from "react-router-dom"; // or next/navigation if using Next.js
import Sidebar from "@/components/Sidebar";
import { useApi } from "@/contexts/ApiProvider";

export default function UserDetail() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    is_active: false,
    is_staff: false,
  });
  const [open, setOpen] = useState(true);
  const api = useApi();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        debugger
        const response = await api.get(`/en/api/v1/user/detail/${userId}/`);
        setUser(response.body.data);
        setFormData({
          first_name: response.body.data.first_name || '',
          last_name: response.body.data.last_name || '',
          email: response.body.data.email,
          is_active: response.body.data.is_active,
          is_staff: response.body.data.is_staff,
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.patch(`/en/api/v1/user/update/${userId}/`, formData);
      // Refresh user data after update
      const response = await api.get(`/en/api/v1/user/detail/${userId}/`);
      setUser(response.body.data);
      setEditMode(false);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-800">
        <Sidebar open={open} setOpen={setOpen} />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full bg-gray-900">
        <Sidebar open={open} setOpen={setOpen} />
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-red-500 text-white p-4 rounded-lg">
            Error: {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div dir="ltr" className="flex h-full bg-gray-900">
      <Sidebar open={open} setOpen={setOpen} />

      <div className="flex-1 flex flex-col md:h-screen bg-gradient-to-r from-gray-800 to-gray-900 overflow-auto">
        <div className="md:hidden">
          {/* <Header /> */}
        </div>

        <div className="flex-1 p-5 mt-[6%]">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-white">User Details</h1>
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Back to Users
              </button>
            </div>

            <div className="bg-gray-800 rounded-xl shadow-lg p-6">
              {editMode ? (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-gray-300 mb-2">First Name</label>
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Last Name</label>
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex items-center space-x-4">
                      <div>
                        <label className="flex items-center space-x-2 text-gray-300">
                          <input
                            type="checkbox"
                            name="is_active"
                            checked={formData.is_active}
                            onChange={handleInputChange}
                            className="rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500"
                          />
                          <span>Active</span>
                        </label>
                      </div>
                      <div>
                        <label className="flex items-center space-x-2 text-gray-300">
                          <input
                            type="checkbox"
                            name="is_staff"
                            checked={formData.is_staff}
                            onChange={handleInputChange}
                            className="rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500"
                          />
                          <span>Staff Member</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setEditMode(false)}
                      className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="flex items-start space-x-6 mb-8">
                    <div className="flex-shrink-0 h-20 w-20 bg-gray-600 rounded-full flex items-center justify-center text-gray-300 text-2xl">
                      {user.first_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        {user.first_name || 'No name'} {user.last_name}
                      </h2>
                      <p className="text-gray-400">{user.email}</p>
                      <div className="flex space-x-2 mt-2">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.is_active ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'}`}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-900 text-purple-200">
                          {user.is_superuser ? 'Admin' : user.is_staff ? 'Staff' : 'User'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-300 mb-4">Basic Information</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-400">Joined Date</p>
                          <p className="text-white">{new Date(user.date_joined).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Last Login</p>
                          <p className="text-white">
                            {user.last_login ? new Date(user.last_login).toLocaleString() : 'Never'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Phone Number</p>
                          <p className="text-white">{user.phone_number || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-300 mb-4">Additional Information</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-400">Date of Birth</p>
                          <p className="text-white">{user.date_birth || 'Not provided'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Gender</p>
                          <p className="text-white">{user.gender || 'Not specified'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Status</p>
                          <p className="text-white">{user.status}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => setEditMode(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Edit Profile
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}