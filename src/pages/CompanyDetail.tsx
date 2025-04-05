import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { useApi } from "@/contexts/ApiProvider";

export default function CompanyDetail() {
  const { compid } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    status: 2,
  });
  const [open, setOpen] = useState(true);
  const api = useApi();

  const getStatusBadge = (status) => {
    switch(status) {
      case 1: return { text: 'Active', color: 'bg-green-900 text-green-200' };
      case 2: return { text: 'Inactive', color: 'bg-red-900 text-red-200' };
      default: return { text: 'Unknown', color: 'bg-gray-700 text-gray-300' };
    }
  };

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/en/api/v1/company/detail/${compid}/`);
        setCompany(response.body.data);
        setFormData({
          name: response.body.data.name || '',
          email: response.body.data.email || '',
          phone: response.body.data.phone || '',
          website: response.body.data.website || '',
          status: response.body.data.status || 2,
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCompany();
  }, [compid, api]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleStatusChange = (e) => {
    setFormData({
      ...formData,
      status: parseInt(e.target.value),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.patch(`/en/api/v1/company/update/${compid}/`, formData);
      const response = await api.get(`/en/api/v1/company/detail/${compid}/`);
      setCompany(response.body.data);
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
      <div className="flex h-screen bg-gray-800">
        <Sidebar open={open} setOpen={setOpen} />
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-red-500 text-white p-4 rounded-lg">
            Error: {error}
          </div>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex h-full bg-gray-900">
        <Sidebar open={open} setOpen={setOpen} />
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-yellow-500 text-white p-4 rounded-lg">
            Company not found
          </div>
        </div>
      </div>
    );
  }

  const statusBadge = getStatusBadge(company.status);

  return (
    <div dir="ltr" className="flex h-screen bg-gray-800">
      <Sidebar open={open} setOpen={setOpen} />

      <div className="flex-1 flex flex-col md:h-screen bg-gradient-to-r from-gray-800 to-gray-900 overflow-auto">
        <div className="md:hidden">
          {/* Mobile header would go here */}
        </div>

        <div className="flex-1 p-5">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-white">Company Details</h1>
              <button
                onClick={() => navigate('/companies')}
                className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Back to Companies
              </button>
            </div>

            <div className="bg-gray-800 rounded-xl shadow-lg p-6">
              {editMode ? (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-gray-300 mb-2">Company Name*</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
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
                    <div>
                      <label className="block text-gray-300 mb-2">Phone*</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Website</label>
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Status*</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleStatusChange}
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value={1}>Active</option>
                        <option value={2}>Inactive</option>
                      </select>
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
                    <div className="flex-shrink-0">
          
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        {company.name}
                      </h2>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusBadge.color}`}>
                          {statusBadge.text}
                        </span>
                        <span className="text-sm text-gray-400">
                          ID: {company.id}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-300 mb-4">Company Information</h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Category</p>
                          <p className="text-white">
                            {company.category?.title || 'N/A'}
                            {company.category && (
                              <span className="ml-2 text-xs text-gray-400">(ID: {company.category.id})</span>
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Email</p>
                          <p className="text-white">
                            {company.email || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Phone</p>
                          <p className="text-white">
                            {company.phone || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Website</p>
                          <p className="text-white">
                            {company.website ? (
                              <a 
                                href={company.website} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-blue-400 hover:underline break-all"
                              >
                                {company.website}
                              </a>
                            ) : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-300 mb-4">Relationships</h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Owner</p>
                          <p className="text-white">
                            {company.owner?.email || 'N/A'}
                            {company.owner && (
                              <span className="ml-2 text-xs text-gray-400">(ID: {company.owner.id})</span>
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Created At</p>
                          <p className="text-white">
                            {new Date(company.created_at).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Last Updated</p>
                          <p className="text-white">
                            {new Date(company.updated_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-300 mb-4">Address</h3>
                    <div className="bg-gray-700 p-4 rounded-lg">
                      {company.address ? (
                        <div className="space-y-2">
                          <p className="text-white">{company.address.address}</p>
                          <div className="text-sm text-gray-400">
                            <span>Status: {company.address.status}</span>
                            {company.address.user && (
                              <span className="ml-4">User ID: {company.address.user.id}</span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-400">No address provided</p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => setEditMode(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Edit Company
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