import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { useApi } from "@/contexts/ApiProvider";

export default function DocumentCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    file: null,
    type_verifier_driver: '',
    verifier_driver: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(true);
  const api = useApi();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      file: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const formDataToSend = new FormData();
      formDataToSend.append('file', formData.file);
      formDataToSend.append('type_verifier_driver', formData.type_verifier_driver);
      formDataToSend.append('verifier_driver', formData.verifier_driver);

      const response = await api.post('/en/api/v1/driver/document/create/', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      navigate(`/driver/documents/${response.body.data.id}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div dir="ltr" className="flex h-full bg-gray-900">
      <Sidebar open={open} setOpen={setOpen} />

      <div className="flex-1 flex flex-col md:h-screen bg-gradient-to-r from-gray-800 to-gray-900 overflow-auto">
        <div className="flex-1 p-5">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-white">Upload New Document</h1>
              <button
                onClick={() => navigate('/driver/documents')}
                className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Back to Documents
              </button>
            </div>

            <div className="bg-gray-800 rounded-xl shadow-lg p-6">
              {error && (
                <div className="bg-red-500 text-white p-4 rounded-lg mb-6">
                  Error: {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 mb-6">
                  <div>
                    <label className="block text-gray-300 mb-2">Document File*</label>
                    <input
                      type="file"
                      name="file"
                      onChange={handleFileChange}
                      className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Type Verifier Driver ID*</label>
                    <input
                      type="number"
                      name="type_verifier_driver"
                      value={formData.type_verifier_driver}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Verifier Driver*</label>
                    <input
                      type="text"
                      name="verifier_driver"
                      value={formData.verifier_driver}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Uploading...' : 'Upload Document'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}