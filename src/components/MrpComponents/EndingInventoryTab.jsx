import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../api"; // Adjust path if needed

function EndingInventoryTab() {
    const { idofinventory } = useParams();
    const [endingInventory, setEndingInventory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`/mrp/get-inventory-items/${idofinventory}/`);
                setEndingInventory(response.data);
            } catch (error) {
                console.error("Error fetching ending inventory:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [idofinventory]);

    return (
        <div>
            <h2>Ending Inventory Report</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div style={{ overflowY: "auto", maxHeight: "calc(100vh - 238px)" }}>
                    <table className="table table-striped table-bordered">
                        <thead className="table-dark" style={{ position: "sticky", top: 0, backgroundColor: "white", boxShadow: "0px -8px 10px rgba(0, 0, 0, 0.4)" }}>
                            <tr>
                                <th>Category</th>
                                <th>BOS Code</th>
                                <th>Material Description</th>
                                <th>Actual Ending</th>
                                <th>Upcoming Delivery</th>
                            </tr>
                        </thead>
                        <tbody>
                            {endingInventory.length > 0 ? (
                                endingInventory.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.bom_entry.category || "-"}</td>
                                        <td>{item.bom_entry.bos_code}</td>
                                        <td>{item.bom_entry.bos_material_description}</td>
                                        <td>{item.actual_ending}</td>
                                        <td>{item.upcoming_delivery}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center">No data found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default EndingInventoryTab;