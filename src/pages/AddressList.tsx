import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { useApi } from "@/contexts/ApiProvider";

export default function AddressList() {
  const [open, setOpen] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    totalResults: 0,
    perPage: 15,
    currentPage: 1,
    nextLink: null
  });
  const navigate = useNavigate();
  const api = useApi();

  const fetchAddresses = async (page = 1) => {
    try {
      setLoading(true);
      const response = await api.get(`/en/api/v1/user/address/list/?page=${page}`);
      setAddresses(response.body.data);
      setPagination({
        totalResults: response.body.total_results,
        perPage: response.body.per_page,
        currentPage: response.body.page_now,
        nextLink: response.body.next_link
      });
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handlePageChange = (newPage) => {
    fetchAddresses(newPage);
  };

  const handleViewDetails = (addressId) => {
    navigate(`/user/addresses/${addressId}`);
  };

  const handleCreate = () => {
    navigate('/user/addresses/create');
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 1: return { text: 'Active', color: 'bg-green-900 text-green-200' };
      case 2: return { text: 'Inactive', color: 'bg-red-900 text-red-200' };
      default: return { text: 'Unknown', color: 'bg-gray-700 text-gray-300' };
    }
  };

  const getTypeBadge = (type) => {
    switch(type) {
      case 1: return { text: 'Home', color: 'bg-blue-900 text-blue-200' };
      case 2: return { text: 'Work', color: 'bg-purple-900 text-purple-200' };
      default: return { text: 'Other', color: 'bg-gray-700 text-gray-300' };
    }
  };

  return (
    <div dir="ltr" className="flex h-full bg-gray-900">
      <Sidebar open={open} setOpen={setOpen} />

      <div className="flex-1 flex flex-col md:h-screen bg-gradient-to-r from-gray-800 to-gray-900 overflow-auto">
        <div className="flex-1 p-5">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-white">User Addresses</h1>
              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-zinc-700 text-white rounded-md hover:bg-zinc-600 transition-colors"
              >
               Add New
              </button>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-500 text-white p-4 rounded-lg">
                Error: {error}
              </div>
            ) : (
              <>
                <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-4">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                      <thead className="bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">City</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Province</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Address</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Created At</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-gray-800 divide-y divide-gray-700">
                        {addresses.map((address) => {
                          const statusBadge = getStatusBadge(address.status);
                          const typeBadge = getTypeBadge(address.type);
                          return (
                            <tr key={address.id} className="hover:bg-gray-700 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{address.id}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{address.city}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{address.province}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{address.address}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${typeBadge.color}`}>
                                  {typeBadge.text}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusBadge.color}`}>
                                  {statusBadge.text}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                {new Date(address.created_at).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                <button
                                  onClick={() => handleViewDetails(address.id)}
                                  className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                >
                                  View
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-4 py-3 bg-gray-800 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-400">
                      Page <span className="font-medium">{pagination.currentPage}</span> of{' '}
                      <span className="font-medium">{Math.ceil(pagination.totalResults / pagination.perPage)}</span>
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
                      className={`px-4 py-2 rounded-md ${pagination.currentPage === 1 ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={!pagination.nextLink}
                      className={`px-4 py-2 rounded-md ${!pagination.nextLink ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}