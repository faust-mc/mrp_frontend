import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import navigation hook
import api from "../api"; // Import Axios instance
import { ACCESS_TOKEN } from '../constants';
import { jwtDecode } from "jwt-decode";
import { ModuleProvider, useModuleContext } from "../components/ControlComponents/ModuleContext";

function Inventory() {
    const { modules, setModules, accessPermissions, setAccessPermissions } = useModuleContext();
    const token = localStorage.getItem(ACCESS_TOKEN);

    const navigate = useNavigate(); // Initialize navigate function

    const [inventoryCodes, setInventoryCodes] = useState([]);
    const [areas, setAreas] = useState([]);
    const [selectedArea, setSelectedArea] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const decodedToken = jwtDecode(token);
        const extractedUserId = decodedToken.user_id;

        //fetch all areas for dropdown
        const fetchAreas = async () => {
            try {
                const response = await api.get(`/mrp/get-area-option/${extractedUserId}/`);
                setAreas(response.data.areas);
            } catch (error) {
                console.error("Error fetching areas:", error);
            }
        };
        fetchAreas();
    }, []);

    useEffect(() => {
        if (selectedArea) {
            setLoading(true);
            const fetchInventoryCodes = async () => {
                try {
                    const response = await api.get(`/mrp/areainventory/${selectedArea}/`);
                    setInventoryCodes(response.data);
                } catch (error) {
                    console.error("Error fetching inventory codes:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchInventoryCodes();
        }
    }, [selectedArea]);

    //function to handle row click and navigate to the report page
    const handleRowClick = (inventoryId) => {
        navigate(`mrp/reports/${inventoryId}`);
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-3">Inventory Codes</h2>

            {/* Area Selection Dropdown */}
            <div className="mb-3">
                <label className="form-label">Select Area:</label>
                <select
                    className="form-select"
                    onChange={(e) => setSelectedArea(e.target.value)}
                    value={selectedArea}
                >
                    <option value="">Select an Area</option>
                    {areas.map(area => (
                        <option key={area.id} value={area.id}>{area.location}</option>
                    ))}
                </select>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped table-bordered">
                        <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Inventory Code</th>
                                <th>Area</th>
                                <th>Status</th>
                                <th>Created At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventoryCodes.length > 0 ? (
                                inventoryCodes.map(item => (
                                    <tr
                                        key={item.id}
                                        onClick={() => handleRowClick(item.id)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <td>{item.id}</td>
                                        <td>{item.inventory_code}</td>
                                        <td>{item.area_name}</td>
                                        <td>{item.status_name}</td>
                                        <td>{new Date(item.created_at).toLocaleString()}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center">No inventory codes found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default Inventory;
