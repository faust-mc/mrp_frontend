import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../api"; // Adjust path if needed

function InitialReplenishmentTab() {
    const { idofinventory } = useParams();
    const [initialReplenishment, setInitialReplenishment] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`/mrp/get-initial-replenishment/${idofinventory}/?ordering=id`);
                console.log(response)
                setInitialReplenishment(response.data);
            } catch (error) {
                console.error("Error fetching initial replenishment:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [idofinventory]);

    return (
        <div>
            <h2>Initial Replenishment Report</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div style={{ overflowY: "auto", maxHeight: "calc(100vh - 230px)" }}>
                    <table className="table table-striped table-bordered">
                        <thead className="table-dark" style={{ position: "sticky", top: 0, backgroundColor: "white" }}>
                            <tr>
                                <th>ID </th>
                                <th>POS Code</th>
                                <th>Item Description</th>
                                <th>BOS Code</th>
                                <th>Average Daily Usage</th>
                                <th>Daily Sales</th>
                                <th>Weekly Usage</th>
                                <th>Safety Stock</th>
                                <th>Forecast Weekly Consumption</th>
                            </tr>
                        </thead>
                        <tbody>
                            {initialReplenishment.length > 0 ? (
                                initialReplenishment.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item[7]}</td>
                                        <td>{item[6]}</td>
                                        <td>{item[5]}</td>
                                        <td>{item[3]}</td>
                                        <td>{item[8]}</td>
                                        <td>{item[9]}</td>
                                        <td>{item[10]}</td>
                                        <td>{item[11]}</td>
                                        <td>{item[12]}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center">No data found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default InitialReplenishmentTab;