import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";

import { useNavigate } from "react-router-dom";
import { useApi } from "@/contexts/ApiProvider";

export default function DriversListPage() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [driversData, setDriversData] = useState({
    drivers: [],
    totalResults: 0,
    perPage: 15,
    currentPage: 1,
    nextLink: null,
    status: false,
    message: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const api = useApi();

  const fetchDrivers = async (page = 1) => {
    try {
      setLoading(true);
      const response = await api.get(`/en/api/v1/driver/list/?page=${page}`);
      setDriversData({
        drivers: response.body.data,
        totalResults: response.body.total_results,
        perPage: response.body.per_page,
        currentPage: response.body.page_now,
        nextLink: response.body.next_link,
        status: response.body.status,
        message: response.body.message
      });
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(driversData.totalResults / driversData.perPage)) {
      fetchDrivers(newPage);
    }
  };

  const handleViewDetails = (driverId) => {
    navigate(`/drivers/${driverId}`);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 1: return { text: 'Active', color: 'bg-green-900 text-green-200' };
      case 2: return { text: 'Inactive', color: 'bg-red-900 text-red-200' };
      default: return { text: 'Unknown', color: 'bg-gray-700 text-gray-300' };
    }
  };

  const getTypeText = (type) => {
    switch(type) {
      case 1: return 'Truck';
      case 2: return 'Van';
      default: return 'Other';
    }
  };

  const totalPages = Math.ceil(driversData.totalResults / driversData.perPage);

  return (
    <div dir="ltr" className="flex h-full bg-gray-900">
      <Sidebar open={open} setOpen={setOpen} />

      <div className="flex-1 flex flex-col md:h-screen bg-gradient-to-r from-gray-800 to-gray-900 overflow-auto">
        <div className="flex-1 p-5">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-white">Drivers Management</h1>
              <div className="text-gray-300">
                Showing {(driversData.currentPage - 1) * driversData.perPage + 1}-
                {Math.min(driversData.currentPage * driversData.perPage, driversData.totalResults)} of {driversData.totalResults} drivers
              </div>
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
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            ID
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Driver
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            User
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            License
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Vehicle
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Rating
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-gray-800 divide-y divide-gray-700">
                        {driversData.drivers.map((driver) => {
                          const statusBadge = getStatusBadge(driver.status);
                          return (
                            <tr key={driver.id} className="hover:bg-gray-700 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
                                {driver.id}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10">
                                    {driver.image ? (
                                      <img 
                                        className="h-10 w-10 rounded-full object-cover" 
                                        src={driver.image} 
                                        alt={driver.title} 
                                        onError={(e) => {
                                          e.target.onerror = null; 
                                          e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="%234B5563"><rect width="100" height="100" rx="50"/><text x="50%" y="50%" font-size="50" dominant-baseline="middle" text-anchor="middle" fill="%23D1D5DB">D</text></svg>'
                                        }}
                                      />
                                    ) : (
                                      <div className="h-10 w-10 bg-gray-600 rounded-full flex items-center justify-center text-gray-300">
                                        D
                                      </div>
                                    )}
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-white">
                                      {driver.title}
                                    </div>
                                    <div className="text-sm text-gray-400">
                                      {driver.track_info}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                {driver.user?.email || 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                {driver.license_number}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                <div>
                                  <div>{getTypeText(driver.type)}</div>
                                  <div className="text-xs text-gray-400">{driver.iran_plaque} / {driver.transit_plaque}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusBadge.color}`}>
                                  {statusBadge.text}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <svg
                                      key={i}
                                      className={`w-4 h-4 ${i < driver.rating ? 'text-yellow-400' : 'text-gray-500'}`}
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  ))}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                <button
                                  onClick={() => handleViewDetails(driver.id)}
                                  className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                >
                                  View Details
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
                      Page <span className="font-medium">{driversData.currentPage}</span> of <span className="font-medium">{totalPages}</span>
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePageChange(driversData.currentPage - 1)}
                      disabled={driversData.currentPage === 1}
                      className={`px-4 py-2 rounded-md ${driversData.currentPage === 1 ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded-md ${driversData.currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(driversData.currentPage + 1)}
                      disabled={driversData.currentPage === totalPages || totalPages === 0}
                      className={`px-4 py-2 rounded-md ${driversData.currentPage === totalPages || totalPages === 0 ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
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