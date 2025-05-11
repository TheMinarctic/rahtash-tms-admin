import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";

import { useNavigate } from "react-router-dom"; // or next/navigation if using Next.js
import { useApi } from "@/contexts/ApiProvider";

export default function CompaniesPage() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [companiesData, setCompaniesData] = useState({
    companies: [],
    totalResults: 0,
    perPage: 15,
    currentPage: 1,
    nextLink: null,
    status: false,
    message: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const api = useApi();

  const fetchCompanies = async (page = 1) => {
    try {
      setLoading(true);
      const response = await api.get(`/en/api/v1/company/list/?page=${page}`);
      setCompaniesData({
        companies: response.body.data,
        totalResults: response.body.total_results,
        perPage: response.body.per_page,
        currentPage: response.body.page_now,
        nextLink: response.body.next_link,
        status: response.body.status,
        message: response.body.message,
      });
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(companiesData.totalResults / companiesData.perPage)) {
      fetchCompanies(newPage);
    }
  };

  const handleViewDetails = (companyId) => {
    navigate(`/companies/${companyId}`);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 1:
        return { text: "Active", color: "bg-green-900 text-green-200" };
      case 2:
        return { text: "Inactive", color: "bg-red-900 text-red-200" };
      default:
        return { text: "Unknown", color: "bg-gray-700 text-gray-300" };
    }
  };

  const totalPages = Math.ceil(companiesData.totalResults / companiesData.perPage);

  return (
    <div className="flex h-screen bg-gray-800">
      <Sidebar open={open} setOpen={setOpen} />

      <div className="flex-1 flex flex-col md:h-screen bg-gradient-to-r from-gray-800 to-gray-900 overflow-auto">
        <div className="md:hidden">{/* <Header /> */}</div>

        <div className="flex-1 p-5">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-white">Companies Management</h1>
              <div className="text-gray-300">
                Showing {(companiesData.currentPage - 1) * companiesData.perPage + 1}-
                {Math.min(
                  companiesData.currentPage * companiesData.perPage,
                  companiesData.totalResults
                )}{" "}
                of {companiesData.totalResults} companies
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-500 text-white p-4 rounded-lg">Error: {error}</div>
            ) : (
              <>
                <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-4">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                      <thead className="bg-gray-700">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                          >
                            ID
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                          >
                            Company
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                          >
                            Category
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                          >
                            Owner
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                          >
                            Phone
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                          >
                            Status
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                          >
                            Created At
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-gray-800 divide-y divide-gray-700">
                        {companiesData.companies.map((company) => {
                          const statusBadge = getStatusBadge(company.status);
                          return (
                            <tr key={company.id} className="hover:bg-gray-700 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
                                {company.id}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10">
                                    {company.logo ? (
                                      <img
                                        className="h-10 w-10 rounded-full object-cover"
                                        src={company.logo}
                                        alt={company.name}
                                      />
                                    ) : (
                                      <div className="h-10 w-10 bg-gray-600 rounded-full flex items-center justify-center text-gray-300">
                                        {company.name?.charAt(0) || "C"}
                                      </div>
                                    )}
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-white">
                                      {company.name}
                                    </div>
                                    <div className="text-sm text-gray-400">{company.website}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                {company.category?.title || "N/A"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                {company.owner?.email || "N/A"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                {company.phone || "N/A"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusBadge.color}`}
                                >
                                  {statusBadge.text}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                {new Date(company.created_at).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                <button
                                  onClick={() => handleViewDetails(company.id)}
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
                      Page <span className="font-medium">{companiesData.currentPage}</span> of{" "}
                      <span className="font-medium">{totalPages}</span>
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePageChange(companiesData.currentPage - 1)}
                      disabled={companiesData.currentPage === 1}
                      className={`px-4 py-2 rounded-md ${
                        companiesData.currentPage === 1
                          ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                          : "bg-gray-700 text-white hover:bg-gray-600"
                      }`}
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded-md ${
                          companiesData.currentPage === page
                            ? "bg-blue-600 text-white"
                            : "bg-gray-700 text-white hover:bg-gray-600"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(companiesData.currentPage + 1)}
                      disabled={companiesData.currentPage === totalPages || totalPages === 0}
                      className={`px-4 py-2 rounded-md ${
                        companiesData.currentPage === totalPages || totalPages === 0
                          ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                          : "bg-gray-700 text-white hover:bg-gray-600"
                      }`}
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
