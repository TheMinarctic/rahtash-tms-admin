import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { useApi } from "@/contexts/ApiProvider";

export default function DocumentDetail() {
  const { document_id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    file: null,
    type_verifier_driver: '',
    verifier_driver: ''
  });
  const [open, setOpen] = useState(true);
  const api = useApi();

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/en/api/v1/driver/document/detail/${document_id}/`);
        setDocument(response.body.data);
        setFormData({
          type_verifier_driver: response.body.data.type_verifier_driver,
          verifier_driver: response.body.data.verifier_driver
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDocument();
  }, [document_id]);

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
      if (formData.file) {
        formDataToSend.append('file', formData.file);
      }
      formDataToSend.append('type_verifier_driver', formData.type_verifier_driver);
      formDataToSend.append('verifier_driver', formData.verifier_driver);

      await api.patch(`/en/api/v1/driver/document/update/${document_id}/`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      const response = await api.get(`/en/api/v1/driver/document/detail/${document_id}/`);
      setDocument(response.body.data);
      setEditMode(false);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        setLoading(true);
        await api.delete(`/en/api/v1/driver/document/delete/${document_id}/`);
        navigate('/driver/documents');
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

  return (
    <div dir="ltr" className="flex h-full bg-gray-900">
      <Sidebar open={open} setOpen={setOpen} />

      <div className="flex-1 flex flex-col md:h-screen bg-gradient-to-r from-gray-800 to-gray-900 overflow-auto">
        <div className="flex-1 p-5">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-white">Document Details</h1>
              <button
                onClick={() => navigate('/driver/documents')}
                className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Back to Documents
              </button>
            </div>

            <div className="bg-gray-800 rounded-xl shadow-lg p-6">
              {editMode ? (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-6 mb-6">
                    <div>
                      <label className="block text-gray-300 mb-2">Document File (Leave empty to keep current)</label>
                      <input
                        type="file"
                        name="file"
                        onChange={handleFileChange}
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      <p className="text-white">{document.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Type Verifier Driver ID</p>
                      <p className="text-white">{document.type_verifier_driver}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Verifier Driver</p>
                      <p className="text-white">{document.verifier_driver}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Created At</p>
                      <p className="text-white">{new Date(document.created_at).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Updated At</p>
                      <p className="text-white">{new Date(document.updated_at).toLocaleString()}</p>
                    </div>
                    {document.file && (
                      <div>
                        <p className="text-sm text-gray-400">Document</p>
                        <a 
                          href={document.file} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          View Document
                        </a>
                      </div>
                    )}
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