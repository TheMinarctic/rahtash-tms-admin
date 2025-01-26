import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "sonner";
import { useApi } from "@/contexts/ApiProvider";
import { Plus, Save } from "lucide-react";
import { VscCloudDownload } from "react-icons/vsc";
import { FaRegEdit } from "react-icons/fa";
import { TiTrash } from "react-icons/ti";
import { GoContainer } from "react-icons/go";
import { IoArrowBack } from "react-icons/io5"; 
import { useNavigate } from "react-router-dom";

export default function Shipment({ id }) {
  const api = useApi();

  const [shipmentData, setShipmentData] = useState(null);

  const [loadingPage, setLoadingPage] = useState(false);
  const [error, setError] = useState(null);

  // State for editable fields
  const [shipmentName, setShipmentName] = useState("");
  const [ladingNumber, setLadingNumber] = useState("");
  const [numberOfContainers, setNumberOfContainers] = useState();
  const [portOfLoading, setPortOfLoading] = useState("");
  const [portOfDischarge, setPortOfDischarge] = useState("");
  const [deliveryPlace, setDeliveryPlace] = useState("");
  const [containsDangerousGoods, setContainsDangerousGoods] = useState(false);

  // States for file uploads
  const [msdsDocument, setMsdsDocument] = useState(null);
  const [msdsDocumentName, setMsdsDocumentName] = useState("");

  const [billOfLadingDocument, setBillOfLadingDocument] = useState(null);
  const [billOfLadingName, setBillOfLadingName] = useState("");

  const [packingList, setPackingList] = useState(null);
  const [packingListName, setPackingListName] = useState("");

  const [initialInvoice, setInitialInvoice] = useState(null);
  const [initialInvoiceName, setInitialInvoiceName] = useState("");

  const [finalInvoice, setFinalInvoice] = useState(null);
  const [finalInvoiceName, setFinalInvoiceName] = useState("");

  const [isMsdsChecked, setIsMsdsChecked] = useState(containsDangerousGoods);

  // Modal States for adding additional documents
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDocumentName, setNewDocumentName] = useState("");
  const [newDocumentFile, setNewDocumentFile] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [containerToDelete, setContainerToDelete] = useState(null);

  const [notes, setNotes] = useState("");

  // State for date fields
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");

  const [persianYear, setPersianYear] = useState("");
const [persianMonth, setPersianMonth] = useState("");
const [persianDay, setPersianDay] = useState("");

  // Function to handle the delete request
  const handleDeleteContainer = async () => {
    if (containerToDelete) {
      const response = await api.delete(
        `/api/v1/shipments/containers/${containerToDelete.id}/`
      );
      if (response.ok) {
        toast.success("Container deleted successfully");
        fetchContainers(); // Re-fetch containers to update the state
      } else {
        toast.error("Error deleting container");
      }
      setIsDeleteModalOpen(false);
      setContainerToDelete(null);
    }
  };

  const [containers, setContainers] = useState([]);
  const [isAddContainerModalOpen, setIsAddContainerModalOpen] = useState(false);
  const [newContainerNumber, setNewContainerNumber] = useState("");
  const [containerSize, setContainerSize] = useState("20ft"); // Default value
  const [customSize, setCustomSize] = useState("");
  const [isEditContainerModalOpen, setIsEditContainerModalOpen] =
    useState(false);
  const [selectedContainer, setSelectedContainer] = useState(null);
  const [newContainerPart1, setNewContainerPart1] = useState("");
  const [newContainerPart2, setNewContainerPart2] = useState("");
  const navigate = useNavigate();

  // Function to format the date as yyyy-mm-dd
  const formatDate = (year, month, day) => {
    const formattedMonth = month.padStart(2, "0");
    const formattedDay = day.padStart(2, "0");
    return `${year}-${formattedMonth}-${formattedDay}`;
  };

    // Function to format the date as yyyy-mm-dd
    const formatJalaliDate = (year, month, day) => {
      const formattedMonth = month.padStart(2, "0");
      const formattedDay = day.padStart(2, "0");
      return `${year}-${formattedMonth}-${formattedDay}`;
    };

  const fetchShipment = async (url) => {
    setLoadingPage(true);
    try {
      const response = await api.get(url);
      if (response.ok) {
        setShipmentData(response.body.data);
        // Populate the editable fields with fetched data
        setShipmentName(response.body.data.bill_of_lading_number);
        setDeliveryPlace(response.body.data.place_of_delivery);
        setLadingNumber(response.body.data.bill_of_lading_number);
        setNumberOfContainers(response.body.data.container_quantity);
        setPortOfLoading(response.body.data.port_of_loading);
        setPortOfDischarge(response.body.data.port_of_discharge);
        setContainsDangerousGoods(response.body.data.contains_dangerous_goods);
        setIsMsdsChecked(response.body.data.contains_dangerous_goods);

        setNotes(response.body.notes || ""); // Set existing notes or default to

        // Initialize date fields from fetched data
        if (response.body.data.date_of_loading_georgian) {
          const [fetchedYear, fetchedMonth, fetchedDay] =
            response.body.data.date_of_loading_georgian.split("-");
          setYear(fetchedYear);
          setMonth(fetchedMonth);
          setDay(fetchedDay);
        }

        if (response.body.data.date_of_loading_persian) {
          const [fetchedYear, fetchedMonth, fetchedDay] =
            response.body.data.date_of_loading_persian.split("-");
          setPersianYear(fetchedYear);
          setPersianMonth(fetchedMonth);
          setPersianDay(fetchedDay);
        }

      } else {
        setError("Error fetching shipment data");
      }
    } catch (error) {
      setError("Failed to fetch shipment data");
    } finally {
      setLoadingPage(false);
    }
  };

  const fetchContainers = async () => {
    try {
      const response = await api.get("/api/v1/shipments/containers/");
      if (response.ok) {
        setContainers(response.body.data);
      } else {
        toast.error("Error fetching containers");
      }
    } catch (error) {
      toast.error("Failed to fetch containers");
    }
  };

  useEffect(() => {
    fetchShipment(`/api/v1/shipments/shipments/${id}`);
    fetchContainers();
  }, [id, api]);

  const handleAddContainerSubmit = async () => {
    const fullContainerNumber = `${newContainerPart1}${newContainerPart2}`;

    const formData = {
      shipment: id,
      container_number: fullContainerNumber,
      container_size: containerSize,
      custom_size: customSize,
    };

    const response = await api.post("/api/v1/shipments/containers/", formData);
    if (response.ok) {
      toast.success("Container added successfully");
      fetchContainers(); // Re-fetch containers
    } else {
      toast.error("Error adding container");
    }

    setIsAddContainerModalOpen(false);
    clearAddContainerFields();
  };

  const clearAddContainerFields = () => {
    setNewContainerNumber("");
    setContainerSize("20ft");
    setCustomSize("");
  };

  const handleEditContainerSubmit = async () => {
    const formData = {
      container_number: selectedContainer.container_number,
      container_size: selectedContainer.container_size,
      custom_size: selectedContainer.custom_size,
    };

    const response = await api.patch(
      `/api/v1/shipments/containers/${selectedContainer.id}/`,
      formData
    );
    if (response.ok) {
      toast.success("Container edited successfully");
      fetchContainers(); // Re-fetch containers
    } else {
      toast.error("Error editing container");
    }

    setIsEditContainerModalOpen(false);
    setSelectedContainer(null); // Reset selected container
  };

  const handleEditSubmit = async () => {
    setLoadingPage(true);

    // Ensure all fields are filled
    if (!shipmentName) {
      toast.error("Please fill the shipment name");
      setLoadingPage(false);
      return;
    }

    if (
      !numberOfContainers ||
      isNaN(numberOfContainers) ||
      Number(numberOfContainers) <= 0
    ) {
      toast.error("Please enter a valid number for the number of containers");
      setLoadingPage(false);
      return;
    }

    if (!year || !month || !day || !persianDay ||!persianMonth || !persianYear) {
      debugger
      toast.error("Please fill in all date fields (year, month, day)");
      setLoadingPage(false);
      return;
    }

    // Format the date as yyyy-mm-dd
    const formattedDate = formatDate(year, month, day);
    const formattedPersianDate = formatJalaliDate(persianYear, persianMonth, persianDay);

    const formData = new FormData();
    formData.append("bill_of_lading_number", shipmentName);
    formData.append("number_of_containers", numberOfContainers);
    formData.append("place_of_delivery", deliveryPlace);
    formData.append("port_of_loading", portOfLoading);
    formData.append("port_of_discharge", portOfDischarge);
    formData.append("contains_dangerous_goods", String(containsDangerousGoods));
    formData.append("notes", notes);

    // Append the formatted date
    formData.append("date_of_loading_georgian", formattedDate);
    formData.append("date_of_loading_persian", formattedPersianDate);
    // Append documents if they have been uploaded
    if (msdsDocument) {
      formData.append("msds_document", msdsDocument);
    }
    if (billOfLadingDocument) {
      formData.append("bill_of_lading_document", billOfLadingDocument);
    }
    if (packingList) {
      formData.append("packing_list", packingList);
    }
    if (initialInvoice) {
      formData.append("initial_invoice", initialInvoice);
    }
    if (finalInvoice) {
      formData.append("final_invoice", finalInvoice);
    }

    const response = await api.patch(
      `/api/v1/shipments/shipments/${id}/`,
      formData
    );
    if (response.ok) {
      toast.success("Shipment edited successfully");
      fetchShipment(`/api/v1/shipments/shipments/${id}`); // Re-fetch data to update state
    } else {
      toast.error("Error editing shipment");
    }
  };

  const handleAddSubmit = async () => {
    if (!newDocumentName || !newDocumentFile) {
      toast.error(
        "Please provide a name and a file for the additional document"
      );
      return;
    }

    const formData = new FormData();
    formData.append("shipment", id);
    formData.append("document_name", newDocumentName);
    formData.append("document_file", newDocumentFile);

    const response = await api.post(
      `/api/v1/shipments/additional-documents/`,
      formData
    );
    if (response.ok) {
      toast.success("Document added successfully");
      fetchShipment(`/api/v1/shipments/shipments/${id}`); // Re-fetch to update the additional documents
      setNewDocumentName(""); // Clear the input field
      setNewDocumentFile(null); // Clear the file
      setIsModalOpen(false); // Close the modal
    } else {
      toast.error("Error adding document");
    }
  };

  useEffect(() => {
    fetchShipment(`/api/v1/shipments/shipments/${id}`);
  }, [id, api]);

  if (loadingPage) {
    return (
      <div className="flex justify-center mt-[27%]">
        <div className="flex flex-row gap-2">
          <div className="w-4 h-4 rounded-full bg-red-500 animate-bounce"></div>
          <div className="w-4 h-4 rounded-full bg-red-500 animate-bounce [animation-delay:-.3s]"></div>
          <div className="w-4 h-4 rounded-full bg-red-500 animate-bounce [animation-delay:-.5s]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-black">{error}</div>;
  }

  return (
    <div className="mt-5 flex flex-col -mr-3 md:mx-auto md:-mr-0">
      <Toaster />
      {shipmentData ? (
        <div className="bg-dark-purple 2xl:w-5/6 p-6 mx-auto rounded-lg">

          {/* Add the Return Button at the top */}
          <div className="flex justify-start mb-4">
            <button
              onClick={() => navigate("/")} // Redirect to the home page
              className="flex items-center  text-black p-2 rounded  transition-colors"
            >
              <IoArrowBack className="mr-2" /> Back
            </button>
          </div>

          <div className="flex flex-col">
            <div className="flex justify-center mt-1 mb-12">
              <div className="flex items-center gap-4">
                <div className="w-20 md:w-64 h-[0.5px] bg-zinc-800"></div>
                <h1 className="text-xl text-center text-black font-bold">
                  Shipment Detail
                </h1>
                <div className="w-20 md:w-64 h-[0.5px] bg-zinc-800"></div>
              </div>
            </div>

            {/* Shipment Details */}
            <div className="grid lg:grid-cols-1 gap-8">
              {/* Existing shipment input fields go here */}
              <div>
                <label className="block text-black pb-2">BL-Number:</label>
                <input
                  type="text"
                  value={shipmentName}
                  onChange={(e) => setShipmentName(e.target.value)}
                  className="w-full p-2 bg-zinc-400 rounded"
                />
              </div>

              <div>
                <label className="block text-black pb-2">
                  Containers quantity:
                </label>
                <input
                  type="text"
                  value={numberOfContainers}
                  readOnly
                  className="w-full p-2 bg-zinc-400 rounded"
                />
              </div>
              <div>
                <label className="block text-black pb-2">
                  Port of Loading:
                </label>
                <input
                  type="text"
                  value={portOfLoading}
                  onChange={(e) => setPortOfLoading(e.target.value)}
                  className="w-full p-2 bg-zinc-400 rounded"
                />
              </div>
              <div>
                <label className="block text-black pb-2">
                  Port of Discharge:
                </label>
                <input
                  type="text"
                  value={portOfDischarge}
                  onChange={(e) => setPortOfDischarge(e.target.value)}
                  className="w-full p-2 bg-zinc-400 rounded"
                />
              </div>
              <div>
                <label className="block text-black pb-2">
                  Place of Delivery:
                </label>
                <input
                  type="text"
                  value={deliveryPlace}
                  onChange={(e) => setDeliveryPlace(e.target.value)}
                  className="w-full p-2 bg-zinc-400 rounded"
                />
              </div>
              <div>
                <label className="block text-black pb-2">Notes:</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows="4"
                  className="w-full p-2 bg-zinc-400 rounded"
                  placeholder="Add any notes here..."
                />
              </div>



              {/* Date Fields */}

              <span>Georgian date:</span>
              <div className="flex gap-4 items-center justify-start">
                <div className="mb-4">
                  <label className="block text-black mb-1">Year:</label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="YYYY"
                    className="w-full p-2 bg-gray-400 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-black"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-black mb-1">Month:</label>
                  <input
                    type="number"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    placeholder="MM"
                    className="w-full p-2 bg-gray-400 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-black"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-black mb-1">Day:</label>
                  <input
                    type="number"
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    placeholder="DD"
                    className="w-full p-2 bg-gray-400 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-black"
                  />
                </div>
              </div>

                           {/* Date Fields */}

                           <span>Persian date:</span>
                           <div className="flex gap-4 items-center justify-start">
                <div className="mb-4">
                  <label className="block text-black mb-1">Year:</label>
                  <input
                    type="number"
                    value={persianYear}
                    onChange={(e) => setPersianYear(e.target.value)}
                    placeholder="YYYY"
                    className="w-full p-2 bg-gray-400 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-black"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-black mb-1">Month:</label>
                  <input
                    type="number"
                    value={persianMonth}
                    onChange={(e) => setPersianMonth(e.target.value)}
                    placeholder="MM"
                    className="w-full p-2 bg-gray-400 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-black"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-black mb-1">Day:</label>
                  <input
                    type="number"
                    value={persianDay}
                    onChange={(e) => setPersianDay(e.target.value)}
                    placeholder="DD"
                    className="w-full p-2 bg-gray-400 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-black"
                  />
                </div>
              </div>

                            {/* Checkbox for Dangerous Goods */}
                            <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={containsDangerousGoods}
                  onChange={() => {
                    setContainsDangerousGoods(!containsDangerousGoods);
                    setIsMsdsChecked(!containsDangerousGoods);
                  }}
                  className="mr-2"
                />
                <label className="text-black">Contains Dangerous Goods</label>
              </div>

              {/* MSDS Document Section */}
            </div>

            {/* Documents Section */}
            <div className="flex justify-center mt-10 mb-12">
              <div className="flex items-center gap-4">
                <div className="w-20 md:w-64 h-[0.5px] bg-zinc-800"></div>
                <h1 className="text-xl text-center text-black font-bold">
                  Documents
                </h1>
                <div className="w-20 md:w-64 h-[0.5px] bg-zinc-800"></div>
              </div>
            </div>

            {/* Existing documents uploading logic... */}
            <div className="grid lg:grid-cols-2 gap-8">
              {[
                {
                  label: "Bill of Lading Document",
                  value: shipmentData.bill_of_lading_document,
                  setFile: setBillOfLadingDocument,
                },
                {
                  label: "Packing List",
                  value: shipmentData.packing_list,
                  setFile: setPackingList,
                },
                {
                  label: "Initial Invoice",
                  value: shipmentData.initial_invoice,
                  setFile: setInitialInvoice,
                },
                {
                  label: "Final Invoice",
                  value: shipmentData.final_invoice,
                  setFile: setFinalInvoice,
                },
              ].map((doc, index) => (
                <div
                  key={index}
                  className="p-4 border rounded shadow-md bg-gray-50"
                >
                  <label className="block text-black font-semibold mb-2">
                    {doc.label}:
                  </label>

                  <div className="flex items-center">
                    <input
                      type="file"
                      onChange={(e) => {
                        doc.setFile(e.target.files[0]);
                      }}
                      accept=".pdf, .doc, .docx"
                      className="hidden"
                      id={`file-upload-${index}`} // unique id for each input
                    />
                    <label
                      htmlFor={`file-upload-${index}`}
                      className="cursor-pointer text-center text-blue-500 underline mr-2"
                    >
                      Upload New File
                    </label>

                    {/* Conditional rendering based on the existence of the document */}
                    {doc.value ? (
                      <a
                        href={doc.value}
                        className="text-blue-400 hover:text-blue-600 ml-2"
                        target="_blank"
                        rel="noreferrer"
                        title="Download"
                      >
                        <VscCloudDownload className="inline w-6 h-6 text-green-500" />
                      </a>
                    ) : (
                      <span className="text-gray-500 ml-2">
                        No file uploaded
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {containsDangerousGoods && (
                <div className="p-4 border rounded shadow-md bg-gray-50">
                  <label className="block text-black font-semibold mb-2">
                    MSDS Document:
                  </label>

                  <div className="flex items-center">
                    <input
                      type="file"
                      onChange={(e) => {
                        setMsdsDocument(e.target.files[0]);
                      }}
                      accept=".pdf, .doc, .docx"
                      className="cursor-pointer border rounded w-full p-1 hidden"
                      id={`file-upload-MSDS`} // unique id for each input
                    />
                    <label
                      htmlFor={`file-upload-MSDS`}
                      className="cursor-pointer text-center text-blue-500 underline mr-2"
                    >
                      Upload New File
                    </label>

                    {/* Conditional rendering based on the existence of the document */}
                    {msdsDocument ? (
                      <a
                        href={msdsDocument.value}
                        className="text-blue-400 hover:text-blue-600 ml-2"
                        target="_blank"
                        rel="noreferrer"
                        title="Download"
                      >
                        <VscCloudDownload className="inline w-6 h-6 text-green-500" />
                      </a>
                    ) : (
                      <span className="text-gray-500 ml-2">
                        No file uploaded
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Remaining container and modal management code... */}
            {/* Container Management Section */}
            <div className="flex justify-center mt-10 mb-12">
              <div className="flex items-center gap-4">
                <div className="w-20 md:w-64 h-[0.5px] bg-zinc-800"></div>
                <h1 className="text-xl text-center text-black font-bold">
                  Containers
                </h1>
                <div className="w-20 md:w-64 h-[0.5px] bg-zinc-800"></div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
              {containers.length === 0 ? (
                <div className="col-span-full text-center text-gray-400">
                  No containers available
                </div>
              ) : (
                containers.map((container) => (
                  <div
                    key={container.id}
                    className="bg-white shadow-md rounded-lg p-4 transition-transform transform hover:scale-105"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <GoContainer className="text-zinc-900 w-8 h-8" />
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedContainer(container);
                            setIsEditContainerModalOpen(true);
                          }}
                          className="text-blue-500 hover:text-blue-700 transition"
                          aria-label={`Edit container ${container.container_number}`}
                        >
                          <FaRegEdit className="w-6 h-6" />
                        </button>
                        <button
                          onClick={() => {
                            setContainerToDelete(container);
                            setIsDeleteModalOpen(true);
                          }}
                          className="text-red-500 hover:text-red-700 transition"
                          aria-label={`Delete container ${container.container_number}`}
                        >
                          <TiTrash className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                    <div className="border-t border-zinc-200 pt-2">
                      <p className="font-semibold">
                        Number:{" "}
                        <span className="text-black">
                          {container.container_number}
                        </span>
                      </p>
                      <p className="text-gray-600">
                        Size:{" "}
                        <span className="text-black">
                          {container.container_size !== "custom"
                            ? container.container_size
                            : container.custom_size + "ft"}
                        </span>
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="flex justify-between mb-4 mt-8">
              <button
                onClick={() => setIsAddContainerModalOpen(true)}
                className="bg-zinc-900 text-white p-2 rounded"
              >
                + Add Container
              </button>
            </div>

            {/* Add Container Modal */}
            {isAddContainerModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
                  <h2 className="text-xl font-bold mb-4">Add New Container</h2>
                  <label className="mb-2">Container Number</label>
                  <div className="flex space-x-2 mb-4 mt-2">
                    <input
                      value={newContainerPart1}
                      onChange={(e) => setNewContainerPart1(e.target.value)}
                      maxLength={4}
                      placeholder="4 chars"
                      className="w-1/3 p-2 border border-gray-600 rounded"
                    />
                    <span className="self-center">-</span>
                    <input
                      value={newContainerPart2}
                      onChange={(e) => setNewContainerPart2(e.target.value)}
                      maxLength={7}
                      placeholder="7 digits"
                      className="w-2/3 p-2 border border-gray-600 rounded"
                    />
                  </div>

                  <label>Container Size</label>
                  <select
                    value={containerSize}
                    onChange={(e) => {
                      setContainerSize(e.target.value);
                      if (e.target.value !== "custom") {
                        setCustomSize("");
                      }
                    }}
                    className="w-full p-2 border border-gray-600 rounded"
                  >
                    <option value="20ft">20ft</option>
                    <option value="40ft">40ft</option>
                    <option value="custom">Custom Size</option>
                  </select>
                  {containerSize === "custom" && (
                    <input
                      placeholder="Enter Custom Size"
                      value={customSize}
                      onChange={(e) => setCustomSize(e.target.value)}
                      className="w-full p-2 mt-2 border rounded"
                    />
                  )}
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => setIsAddContainerModalOpen(false)}
                      className="mr-2 bg-red-500 hover:bg-red-400 text-white p-2 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddContainerSubmit}
                      className="bg-primary text-white p-2 rounded"
                    >
                      Add Container
                    </button>
                  </div>
                </div>
              </div>
            )}

            {isDeleteModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
                  <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
                  <p>
                    Are you sure you want to delete container{" "}
                    {containerToDelete.container_number}?
                  </p>
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => setIsDeleteModalOpen(false)}
                      className="mr-2 bg-red-500 hover:bg-red-400 text-white p-2 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteContainer}
                      className="bg-primary text-white p-2 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Container Modal */}
            {isEditContainerModalOpen && selectedContainer && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
                  <h2 className="text-xl font-bold mb-4">Edit Container</h2>
                  <label>Container Number</label>
                  <div className="flex space-x-2 mb-4">
                    <input
                      value={selectedContainer.container_number.slice(0, 4)} // Get the first 4 chars
                      onChange={(e) => {
                        const newPart1 = e.target.value;
                        const newContainerNumber = `${newPart1}${selectedContainer.container_number.slice(
                          4
                        )}`;
                        setSelectedContainer({
                          ...selectedContainer,
                          container_number: newContainerNumber,
                        });
                      }}
                      maxLength={4}
                      placeholder="4 chars"
                      className="w-1/3 p-2 border border-gray-600 rounded"
                    />
                    <span className="self-center">-</span>
                    <input
                      value={selectedContainer.container_number.slice(4)} // Get the last 7 digits
                      onChange={(e) => {
                        const newPart2 = e.target.value;
                        const newContainerNumber = `${selectedContainer.container_number.slice(
                          0,
                          4
                        )}${newPart2}`;
                        setSelectedContainer({
                          ...selectedContainer,
                          container_number: newContainerNumber,
                        });
                      }}
                      maxLength={7}
                      placeholder="7 digits"
                      className="w-2/3 p-2 border border-gray-600 rounded"
                    />
                  </div>
                  <label>Container Size</label>
                  <select
                    value={selectedContainer.container_size}
                    onChange={(e) =>
                      setSelectedContainer({
                        ...selectedContainer,
                        container_size: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-gray-600 rounded"
                  >
                    <option value="20ft">20ft</option>
                    <option value="40ft">40ft</option>
                    <option value="custom">Custom Size</option>
                  </select>
                  {selectedContainer.container_size === "custom" && (
                    <input
                      placeholder="Enter Custom Size"
                      value={selectedContainer.custom_size}
                      onChange={(e) =>
                        setSelectedContainer({
                          ...selectedContainer,
                          custom_size: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-gray-600 rounded mt-2"
                    />
                  )}
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => setIsEditContainerModalOpen(false)}
                      className="mr-2 bg-red-500 hover:bg-red-400 text-white p-2 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleEditContainerSubmit}
                      className="bg-primary text-white p-2 rounded"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Save Changes Button */}
            <div className="mt-10 w-full flex justify-center px-[5%]">
              <Button
                className="w-2/3 hover:bg-green-400 bg-green-500 text-white"
                size="lg"
                onClick={handleEditSubmit}
              >
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <h1 className="text-black">Something went wrong, please try again</h1>
      )}
    </div>
  );
}