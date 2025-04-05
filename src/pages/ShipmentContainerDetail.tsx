import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { useApi } from "@/contexts/ApiProvider";

export default function ShipmentContainerDetail() {
  const { container_id } = useParams();
  const navigate = useNavigate();
  const [container, setContainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    track_number: '',
    size: '',
    status: 1,
    order: '',
    type: 1,
    shipment: ''
  });
  const [open, setOpen] = useState(true);
  const api = useApi();

  useEffect(() => {
    const fetchContainer = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/en/api/v1/shipment/container/detail/${container_id}/`);
        setContainer(response.body.data);
        setFormData({
          track_number: response.body.data.track_number,
          size: response.body.data.size,
          status: response.body.data.status,
          order: response.body.data.order,
          type: response.body.data.type,
          shipment: response.body.data.shipment?.id || ''
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchContainer();
  }, [container_id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.patch(`/en/api/v1/shipment/container/update/${container_id}/`, formData);
      const response = await api.get(`/en/api/v1/shipment/container/detail/${container_id}/`);
      setContainer(response.body.data);
      setEditMode(false);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this container?')) {
      try {
        setLoading(true);
        await api.delete(`/en/api/v1/shipment/container/delete/${container_id}/`);
        navigate('/shipment/containers');
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
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

  const getStatusBadge = (status) => {
    switch(status) {
      case 1: return { text: 'Active', color: 'bg-green-900 text-green-200' };
      case 2: return { text: 'Inactive', color: 'bg-red-900 text-red-200' };
      default: return { text: 'Unknown', color: 'bg-gray-700 text-gray-300' };
    }
  };

  const getContainerType = (type) => {
    switch(type) {
      case 1: return 'Dry';
      case 2: return 'Reefer';
      case 3: return 'Open Top';
      case 4: return 'Flat Rack';
      default: return 'Unknown';
    }
  };

  const statusBadge = getStatusBadge(container.status);

  return (
    <div dir="ltr" className="flex h-full bg-gray-900">
      <Sidebar open={open} setOpen={setOpen} />

      <div className="flex-1 flex flex-col md:h-screen bg-gradient-to-r from-gray-800 to-gray-900 overflow-auto">
        <div className="flex-1 p-5">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-white">Container Details</h1>
              <button
                onClick={() => navigate('/shipment/containers')}
                className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Back to Containers
              </button>
            </div>

            <div className="bg-gray-800 rounded-xl shadow-lg p-6">
              {editMode ? (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-gray-300 mb-2">Track Number*</label>
                      <input
                        type="text"
                        name="track_number"
                        value={formData.track_number}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Size*</label>
                      <input
                        type="number"
                        name="size"
                        value={formData.size}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
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
                        <option value={1}>Active</option>
                        <option value={2}>Inactive</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Order</label>
                      <input
                        type="number"
                        name="order"
                        value={formData.order}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Type*</label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value={1}>Dry</option>
                        <option value={2}>Reefer</option>
                        <option value={3}>Open Top</option>
                        <option value={4}>Flat Rack</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Shipment ID*</label>
                      <input
                        type="text"
                        name="shipment"
                        value={formData.shipment}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
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
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-400">ID</p>
                      <p className="text-white">{container.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Track Number</p>
                      <p className="text-white">{container.track_number}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Size</p>
                      <p className="text-white">{container.size}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Type</p>
                      <p className="text-white">{getContainerType(container.type)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Status</p>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusBadge.color}`}>
                        {statusBadge.text}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Order</p>
                      <p className="text-white">{container.order}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Shipment</p>
                      <p className="text-white">{container.shipment?.bill_of_lading_number_id || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Created At</p>
                      <p className="text-white">{new Date(container.created_at).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Updated At</p>
                      <p className="text-white">{new Date(container.updated_at).toLocaleString()}</p>
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