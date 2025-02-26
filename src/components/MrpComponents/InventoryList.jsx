import { useEffect, useState } from "react";
import api from "../api"; // Import your custom Axios instance

function InventoryList() {
    const [inventoryCodes, setInventoryCodes] = useState([]);
    const [areas, setAreas] = useState([]);
    const [selectedArea, setSelectedArea] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch all areas for dropdown
        const fetchAreas = async () => {
            try {
                const response = await api.get("/api/areas/");
                setAreas(response.data);
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
                    const response = await api.get(`/api/inventory-codes/${selectedArea}/`);
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
                                    <tr key={item.id}>
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

export default InventoryList;
