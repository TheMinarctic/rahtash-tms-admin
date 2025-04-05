// ShipmentDetail.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { useApi } from "@/contexts/ApiProvider";

export default function ShipmentDetail() {
  const { shipment_id } = useParams();
  const navigate = useNavigate();
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    bill_of_lading_number_id: '',
    contains_dangerous_good: false,
    date_of_loading: '',
    note: '',
    status: 3,
    carrier_company: '',
    forward_company: '',
    driver: '',
    step: '',
    port_loading: '',
    port_discharge: '',
    place_delivery: ''
  });
  const [open, setOpen] = useState(true);
  const api = useApi();

  useEffect(() => {
    const fetchShipment = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/en/api/v1/shipment/detail/${shipment_id}/`);
        setShipment(response.body.data);
        setFormData({
          bill_of_lading_number_id: response.body.data.bill_of_lading_number_id || '',
          contains_dangerous_good: response.body.data.contains_dangerous_good || false,
          date_of_loading: response.body.data.date_of_loading || '',
          note: response.body.data.note || '',
          status: response.body.data.status,
          carrier_company: response.body.data.carrier_company?.id || '',
          forward_company: response.body.data.forward_company?.id || '',
          driver: response.body.data.driver?.id || '',
          step: response.body.data.step?.id || '',
          port_loading: response.body.data.port_loading?.id || '',
          port_discharge: response.body.data.port_discharge?.id || '',
          place_delivery: response.body.data.place_delivery?.id || ''
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchShipment();
  }, [shipment_id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.patch(`/en/api/v1/shipment/update/${shipment_id}/`, formData);
      const response = await api.get(`/en/api/v1/shipment/detail/${shipment_id}/`);
      setShipment(response.body.data);
      setEditMode(false);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this shipment?')) {
      try {
        setLoading(true);
        await api.delete(`/en/api/v1/shipment/delete/${shipment_id}/`);
        navigate('/shipments');
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 1: return { text: 'Pending', color: 'bg-yellow-900 text-yellow-200' };
      case 2: return { text: 'In Progress', color: 'bg-blue-900 text-blue-200' };
      case 3: return { text: 'Completed', color: 'bg-green-900 text-green-200' };
      case 4: return { text: 'Cancelled', color: 'bg-red-900 text-red-200' };
      default: return { text: 'Unknown', color: 'bg-gray-700 text-gray-300' };
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

  const statusBadge = getStatusBadge(shipment.status);

  return (
    <div dir="ltr" className="flex h-full bg-gray-900">
      <Sidebar open={open} setOpen={setOpen} />

      <div className="flex-1 flex flex-col md:h-screen bg-gradient-to-r from-gray-800 to-gray-900 overflow-auto">
        <div className="flex-1 p-5">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-white">Shipment Details</h1>
              <button
                onClick={() => navigate('/shipments')}
                className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Back to Shipments
              </button>
            </div>

            <div className="bg-gray-800 rounded-xl shadow-lg p-6">
              {error && (
                <div className="bg-red-500 text-white p-4 rounded-lg mb-6">
                  Error: {error}
                </div>
              )}

              {editMode ? (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-gray-300 mb-2">Bill of Lading Number*</label>
                      <input
                        type="text"
                        name="bill_of_lading_number_id"
                        value={formData.bill_of_lading_number_id}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Date of Loading</label>
                      <input
                        type="datetime-local"
                        name="date_of_loading"
                        value={formData.date_of_loading}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="contains_dangerous_good"
                        checked={formData.contains_dangerous_good}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-gray-300">Contains Dangerous Goods</label>
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Status*</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value={1}>Pending</option>
                        <option value={2}>In Progress</option>
                        <option value={3}>Completed</option>
                        <option value={4}>Cancelled</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Notes</label>
                      <textarea
                        name="note"
                        value={formData.note}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-400">ID</p>
                        <p className="text-white">{shipment.id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Bill of Lading Number</p>
                        <p className="text-white">{shipment.bill_of_lading_number_id || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Contains Dangerous Goods</p>
                        <p className="text-white">{shipment.contains_dangerous_good ? 'Yes' : 'No'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Date of Loading</p>
                        <p className="text-white">
                          {shipment.date_of_loading ? new Date(shipment.date_of_loading).toLocaleString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-400">Status</p>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusBadge.color}`}>
                          {statusBadge.text}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Created At</p>
                        <p className="text-white">{new Date(shipment.created_at).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Updated At</p>
                        <p className="text-white">{new Date(shipment.updated_at).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Notes</p>
                        <p className="text-white">{shipment.note || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Related entities */}
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-white mb-4">Carrier Company</h3>
                      {shipment.carrier_company ? (
                        <div className="space-y-2">
                          <p className="text-gray-300">Name: {shipment.carrier_company.name}</p>
                          <p className="text-gray-300">Category: {shipment.carrier_company.category?.title || 'N/A'}</p>
                          <p className="text-gray-300">Owner: {shipment.carrier_company.owner?.email || 'N/A'}</p>
                        </div>
                      ) : (
                        <p className="text-gray-400">No carrier company assigned</p>
                      )}
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-white mb-4">Forward Company</h3>
                      {shipment.forward_company ? (
                        <div className="space-y-2">
                          <p className="text-gray-300">Name: {shipment.forward_company.name}</p>
                          <p className="text-gray-300">Category: {shipment.forward_company.category?.title || 'N/A'}</p>
                          <p className="text-gray-300">Owner: {shipment.forward_company.owner?.email || 'N/A'}</p>
                        </div>
                      ) : (
                        <p className="text-gray-400">No forward company assigned</p>
                      )}
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-white mb-4">Driver</h3>
                      {shipment.driver ? (
                        <div className="space-y-2">
                          <p className="text-gray-300">Name: {shipment.driver.title}</p>
                          <p className="text-gray-300">Category: {shipment.driver.category?.title || 'N/A'}</p>
                          <p className="text-gray-300">User: {shipment.driver.user?.email || 'N/A'}</p>
                        </div>
                      ) : (
                        <p className="text-gray-400">No driver assigned</p>
                      )}
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-white mb-4">Current Step</h3>
                      {shipment.step ? (
                        <div className="space-y-2">
                          <p className="text-gray-300">Title: {shipment.step.title}</p>
                          <p className="text-gray-300">Order: {shipment.step.order}</p>
                        </div>
                      ) : (
                        <p className="text-gray-400">No step assigned</p>
                      )}
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-white mb-4">Loading Port</h3>
                      {shipment.port_loading ? (
                        <div className="space-y-2">
                          <p className="text-gray-300">Title: {shipment.port_loading.title}</p>
                          <p className="text-gray-300">Country: {shipment.port_loading.country}</p>
                        </div>
                      ) : (
                        <p className="text-gray-400">No loading port assigned</p>
                      )}
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-white mb-4">Discharge Port</h3>
                      {shipment.port_discharge ? (
                        <div className="space-y-2">
                          <p className="text-gray-300">Title: {shipment.port_discharge.title}</p>
                          <p className="text-gray-300">Country: {shipment.port_discharge.country}</p>
                        </div>
                      ) : (
                        <p className="text-gray-400">No discharge port assigned</p>
                      )}
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-white mb-4">Place of Delivery</h3>
                      {shipment.place_delivery ? (
                        <div className="space-y-2">
                          <p className="text-gray-300">Title: {shipment.place_delivery.title}</p>
                          <p className="text-gray-300">Country: {shipment.place_delivery.country}</p>
                        </div>
                      ) : (
                        <p className="text-gray-400">No place of delivery assigned</p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 mt-6">
                    <button
                      onClick={() => setEditMode(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                      Delete
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