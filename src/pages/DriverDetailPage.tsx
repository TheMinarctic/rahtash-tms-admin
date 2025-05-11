import { useState, useEffect } from "react";

import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import { useApi } from "@/contexts/ApiProvider";

export default function DriverDetailPage() {
  const { driver_id } = useParams();
  const navigate = useNavigate();
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    track_info: "",
    license_number: "",
    smart_card_number: "",
    status: 1,
    iran_plaque: "",
    transit_plaque: "",
    max_cargo_weight: 0,
    type: 1,
  });
  const [open, setOpen] = useState(true);
  const api = useApi();

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

  const getTypeText = (type) => {
    switch (type) {
      case 1:
        return "Truck";
      case 2:
        return "Van";
      default:
        return "Other";
    }
  };

  useEffect(() => {
    const fetchDriver = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/en/api/v1/driver/detail/${driver_id}/`);
        setDriver(response.body.data);
        setFormData({
          title: response.body.data.title || "",
          track_info: response.body.data.track_info || "",
          license_number: response.body.data.license_number || "",
          smart_card_number: response.body.data.smart_card_number || "",
          status: response.body.data.status || 1,
          iran_plaque: response.body.data.iran_plaque || "",
          transit_plaque: response.body.data.transit_plaque || "",
          max_cargo_weight: response.body.data.max_cargo_weight || 0,
          type: response.body.data.type || 1,
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDriver();
  }, [driver_id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleNumberInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: Number(value),
    });
  };

  const handleStatusChange = (e) => {
    setFormData({
      ...formData,
      status: parseInt(e.target.value),
    });
  };

  const handleTypeChange = (e) => {
    setFormData({
      ...formData,
      type: parseInt(e.target.value),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.patch(`/en/api/v1/driver/update/${driver_id}/`, formData);
      // Refresh driver data after update
      const response = await api.get(`/en/api/v1/driver/detail/${driver_id}/`);
      setDriver(response.body.data);
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
          <div className="bg-red-500 text-white p-4 rounded-lg">Error: {error}</div>
        </div>
      </div>
    );
  }

  const statusBadge = getStatusBadge(driver.status);

  return (
    <div className="flex h-full bg-gray-900">
      <Sidebar open={open} setOpen={setOpen} />

      <div className="flex-1 flex flex-col md:h-screen bg-gradient-to-r from-gray-800 to-gray-900 overflow-auto">
        <div className="flex-1 p-5">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-white">Driver Details</h1>
              <button
                onClick={() => navigate("/drivers")}
                className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Back to Drivers
              </button>
            </div>

            <div className="bg-gray-800 rounded-xl shadow-lg p-6">
              {editMode ? (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-gray-300 mb-2">Title*</label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Track Info</label>
                      <input
                        type="text"
                        name="track_info"
                        value={formData.track_info}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">License Number*</label>
                      <input
                        type="text"
                        name="license_number"
                        value={formData.license_number}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Smart Card Number</label>
                      <input
                        type="text"
                        name="smart_card_number"
                        value={formData.smart_card_number}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    <div>
                      <label className="block text-gray-300 mb-2">Vehicle Type*</label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleTypeChange}
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value={1}>Truck</option>
                        <option value={2}>Van</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Iran Plaque</label>
                      <input
                        type="text"
                        name="iran_plaque"
                        value={formData.iran_plaque}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Transit Plaque</label>
                      <input
                        type="text"
                        name="transit_plaque"
                        value={formData.transit_plaque}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Max Cargo Weight (kg)</label>
                      <input
                        type="number"
                        name="max_cargo_weight"
                        value={formData.max_cargo_weight}
                        onChange={handleNumberInputChange}
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="0"
                      />
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
                      {driver.image ? (
                        <img
                          className="h-20 w-20 rounded-full object-cover border-2 border-gray-600"
                          src={driver.image}
                          alt={driver.title}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="%234B5563"><rect width="100" height="100" rx="50"/><text x="50%" y="50%" font-size="50" dominant-baseline="middle" text-anchor="middle" fill="%23D1D5DB">D</text></svg>';
                          }}
                        />
                      ) : (
                        <div className="h-20 w-20 bg-gray-600 rounded-full flex items-center justify-center text-gray-300 text-3xl border-2 border-gray-500">
                          D
                        </div>
                      )}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{driver.title}</h2>
                      <div className="flex items-center space-x-4 mt-2">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${statusBadge.color}`}
                        >
                          {statusBadge.text}
                        </span>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${
                                i < driver.rating ? "text-yellow-400" : "text-gray-500"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm text-gray-400">ID: {driver.id}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-300 mb-4">
                        Driver Information
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Track Info</p>
                          <p className="text-white">{driver.track_info || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 mb-1">License Number</p>
                          <p className="text-white">{driver.license_number || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Smart Card Number</p>
                          <p className="text-white">{driver.smart_card_number || "N/A"}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-300 mb-4">
                        Vehicle Information
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Type</p>
                          <p className="text-white">{getTypeText(driver.type)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Plaques</p>
                          <p className="text-white">
                            {driver.iran_plaque || "N/A"} / {driver.transit_plaque || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Max Cargo Weight</p>
                          <p className="text-white">{driver.max_cargo_weight} kg</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-300 mb-4">Relationships</h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-400 mb-1">User</p>
                          <p className="text-white">
                            {driver.user?.email || "N/A"}
                            {driver.user && (
                              <span className="ml-2 text-xs text-gray-400">
                                (ID: {driver.user.id})
                              </span>
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Category</p>
                          <p className="text-white">
                            {driver.category?.title || "N/A"}
                            {driver.category && (
                              <span className="ml-2 text-xs text-gray-400">
                                (ID: {driver.category.id})
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-300 mb-4">Timestamps</h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Created At</p>
                          <p className="text-white">
                            {new Date(driver.created_at).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Last Updated</p>
                          <p className="text-white">
                            {new Date(driver.updated_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => setEditMode(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Edit Driver
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
