import React, { useState, useEffect } from "react";
import api from "../api";
import ProgressBar from 'react-bootstrap/ProgressBar';
import { Tab, Nav } from 'react-bootstrap';
import { ACCESS_TOKEN } from '../constants';
import { jwtDecode } from "jwt-decode";

function Transactional() {
  const token = localStorage.getItem(ACCESS_TOKEN);
  const [uploadsEndingInventory, setUploadsEndingInventory] = useState([
    { areaId: "", file: null, progress: 0, uploading: false, successMessage: "" }
  ]);
  const [uploadsSales, setUploadsSales] = useState({
    file: null,
    progress: 0,
    uploading: false,
    successMessage: ""
  });
  const [error, setError] = useState("");
  const [areas, setAreas] = useState([]);
  const [samp, setSam] = useState([]);
  const [userId, setUserId] = useState(null);
  const [activeTab, setActiveTab] = useState("upload");

  useEffect(() => {
    if (!token) {
      console.error("Token is missing");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const extractedUserId = decodedToken.user_id;

      if (!extractedUserId) {
        console.error("User ID not found in token");
        return;
      }

      setUserId(extractedUserId);
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }, [token]);

  useEffect(() => {
    const fetchAreas = async () => {
      if (!userId) return;

      try {
        const response = await api.get(`/mrp/get-area-option/${userId}/`);
        setAreas(response.data.areas);
      } catch (error) {
        console.error("Error fetching areas:", error);
      }
    };

    fetchAreas();
  }, [userId]);

  const handleInputChange = (index, field, value) => {
    if (activeTab === "upload") {
      const newUploads = [...uploadsEndingInventory];
      newUploads[index][field] = value;
      setUploadsEndingInventory(newUploads);
    } else if (activeTab === "sales") {
      setUploadsSales(prev => ({ ...prev, [field]: value }));
    }
  };

  const addUploadField = () => {
    setUploadsEndingInventory([...uploadsEndingInventory, { areaId: "", file: null, progress: 0, uploading: false, successMessage: "" }]);
  };

  const handleUpload = async (index) => {
    const { file, areaId } = activeTab === "upload" ? uploadsEndingInventory[index] : uploadsSales;

    if (!file || (activeTab === "upload" && !areaId)) {
        setError("⚠️ Please select an area and a file before uploading.");
        return;
    }

    setError("");

    const formData = new FormData();
    formData.append("file", file);
    if (activeTab === "upload") {
        formData.append("area_id", areaId);
    }

    const setUploads = activeTab === "upload" ? setUploadsEndingInventory : setUploadsSales;

    setUploads(prevUploads => {
        const newUploads = activeTab === "upload" ? [...prevUploads] : { ...prevUploads };
        if (activeTab === "upload") {
            newUploads[index].uploading = true;
        } else {
            newUploads.uploading = true;
        }
        return newUploads;
    });

    let progress = 0;
    const interval = setInterval(() => {
        setUploads(prevUploads => {
            const newUploads = activeTab === "upload" ? [...prevUploads] : { ...prevUploads };
            if (activeTab === "upload") {
                newUploads[index].progress = progress;
            } else {
                newUploads.progress = progress;
            }
            return newUploads;
        });

        progress += 10;
        if (progress >= 90) {
            clearInterval(interval);
        }
    }, 1000);

    try {
        if (!userId) {
            console.error("User ID not found in token");
            return;
        }

        const apiEndpoint =
            activeTab === "sales"
                ? `/mrp/sales-upload/`
                : `/mrp/ending-inventory-upload/`;

        await api.post(apiEndpoint, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        clearInterval(interval);

        setUploads(prevUploads => {
            const newUploads = activeTab === "upload" ? [...prevUploads] : { ...prevUploads };
            if (activeTab === "upload") {
                newUploads[index] = {
                    ...newUploads[index],
                    progress: 100,
                    uploading: false,
                    successMessage: "✅ Success: Uploading Complete",
                };
            } else {
                newUploads.progress = 100;
                newUploads.uploading = false;
                newUploads.successMessage = "✅ Success: Uploading Complete";
            }
            return newUploads;
        });
    } catch (err) {
        clearInterval(interval);

        setUploads(prevUploads => {
            const newUploads = activeTab === "upload" ? [...prevUploads] : { ...prevUploads };
            if (activeTab === "upload") {
                newUploads[index] = {
                    ...newUploads[index],
                    progress: 0,
                    uploading: false,
                    successMessage: "❌ Error: Upload failed. Please try again.",

                };
            } else {
                newUploads.progress = 0;
                newUploads.uploading = false;
                newUploads.successMessage = "❌ Error: Upload failed. Please try again.";
            }
            return newUploads;
        });
    }
};

  const getTabTitle = (tabKey) => {
    switch (tabKey) {
      case "upload":
        return "Upload Ending Inventory";
      case "sales":
        return "Upload Sales";
      default:
        return "Transactional";
    }
  };

  return (
    <div className="p-4">
        {samp}
      <h1 className="text-2xl font-bold mb-4">{getTabTitle(activeTab)}</h1>

      <Tab.Container
        id="left-tabs-example"
        defaultActiveKey="upload"
        activeKey={activeTab}
        onSelect={setActiveTab}
      >
        <Nav variant="tabs">
          <Nav.Item>
            <Nav.Link eventKey="upload">Upload Ending Inventory</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="sales">Upload Sales</Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content className="mt-4">
          <Tab.Pane eventKey="upload">
            {uploadsEndingInventory.map((upload, index) => (
              <div key={index} className="mb-4 border p-4 rounded">
                <div className="w-20">
                  {upload.uploading ? (
                    <div className="font-bold text-blue-500">
                      {areas.find(area => area.id === Number(upload.areaId))?.location || "Uploading..."}
                    </div>
                  ) : (
                    <select
                      value={upload.areaId}
                      onChange={(e) => handleInputChange(index, "areaId", e.target.value)}
                      className="p-2 border rounded mb-2 w-full"
                    >
                      <option value="">Select Area</option>
                      {areas.map((area) => (
                        <option key={area.id} value={area.id}>{area.location}</option>
                      ))}
                    </select>
                  )}
                </div>
                {!upload.uploading ? (
                  <>
                    <input
                      type="file"
                      accept=".xlsx, .xls, .xlsb"
                      onChange={(e) => handleInputChange(index, "file", e.target.files[0])}
                      className="p-2 border rounded mb-2 w-full"
                    />
                    <button
                      onClick={() => handleUpload(index)}
                      className="ml-2 p-2 bg-blue-500 text-black rounded w-80 mt-2"
                    >
                      Upload
                    </button>
                    {upload.successMessage && (
                      <div className="text-green-500 mt-2">{upload.successMessage}</div>
                    )}
                  </>
                ) : (
                  <ProgressBar now={upload.progress} label={`${upload.progress}%`} visuallyHidden />
                )}
              </div>
            ))}
            <button
              onClick={addUploadField}
              className="p-2 bg-green-500 text-black rounded mt-2 w-80"
            >
              Add Another Upload
            </button>
            {error && <p className="text-red-500">{error}</p>}
          </Tab.Pane>

          <Tab.Pane eventKey="sales">
            <div className="mb-4 border p-4 rounded">
              {!uploadsSales.uploading ? (
                <>
                  <input
                    type="file"
                    accept=".xlsx, .xls, .xlsb"
                    onChange={(e) => handleInputChange(0, "file", e.target.files[0])}
                    className="p-2 border rounded mb-2 w-full"
                  />
                  <button
                    onClick={() => handleUpload(0)}
                    className="ml-2 p-2 bg-blue-500 text-black rounded w-80 mt-2"
                  >
                    Upload
                  </button>
                  {uploadsSales.successMessage && (
                    <div className="text-green-500 mt-2">{uploadsSales.successMessage}</div>
                  )}
                </>
              ) : (
                <ProgressBar now={uploadsSales.progress} label={`${uploadsSales.progress}%`} visuallyHidden />
              )}
            </div>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
}

export default Transactional;
