import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../api"; // Adjust path if needed

function ItemSalesTab() {
    const { idofinventory } = useParams();
    const [salesReport, setSalesReport] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`/mrp/sales-report/${idofinventory}/`);
                console.log(response)
                setSalesReport(response.data);
            } catch (error) {
                console.error("Error fetching sales report:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [idofinventory]);

    return (
        <div>
            <h2>Item Sales Report</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div style={{ overflowY: "auto", maxHeight: "calc(100vh - 238px)" }}>
                    <table className="table table-striped table-bordered">
                        <thead className="table-dark" style={{ position: "sticky", top: 0, backgroundColor: "white" ,boxShadow: "0px -8px 10px rgba(0, 0, 0, 0.4)"}}>
                            <tr>
                                <th>Sales Report Name</th>
                                <th>POS Item</th>
                                <th>Dine-in Quantity</th>
                                <th>Take-out Quantity</th>
                                <th>Avg. Dine-in Sold</th>
                                <th>Avg. Take-out Sold</th>

                            </tr>
                        </thead>
                        <tbody>
                            {salesReport.length > 0 ? (
                                salesReport.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.sales_report_name || "-"}</td>
                                        <td>{item.pos_item ? item.pos_item.menu_description : "-"}</td>
                                        <td>{item.dine_in_quantity || 0}</td>
                                        <td>{item.take_out_quantity || 0}</td>
                                        <td>{item.average_dine_in_sold || 0}</td>
                                        <td>{item.average_tako_out_sold || 0}</td>

                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center">No data found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default ItemSalesTab;