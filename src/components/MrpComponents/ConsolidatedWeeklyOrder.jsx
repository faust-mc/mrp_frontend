import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../api"; // Adjust path if needed

function ConsolidatedWeeklyOrder() {
  const { idofinventory } = useParams();
  const [consolidatedOrders, setConsolidatedOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/mrp/consolidated/${idofinventory}/`);
        setConsolidatedOrders(response.data);
      } catch (error) {
        console.error("Error fetching consolidated orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idofinventory]);

  return (
    <div>
      <h2>Consolidated Weekly Order</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ overflowY: "auto", maxHeight: "calc(100vh - 237px)" }}>
          <table className="table table-striped table-bordered">
            <thead
              className="table-dark"
              style={{
                position: "sticky",
                top: 0,
                backgroundColor: "white",
                boxShadow: "0px -8px 10px rgba(0, 0, 0, 0.4)",
              }}
            >
              <tr>
                <th>Delivery Code ID</th>
                <th>BOS Code</th>
                <th>Delivery UOM</th>
                <th>Item Description</th>
                <th>UOM</th>
                <th>First Qty</th>
                <th>Second Qty</th>
                <th>Third Qty</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              {consolidatedOrders.length > 0 ? (
                consolidatedOrders.map((item, index) => (
                  <tr key={index}>
                    <td>{item.delivery_code_id}</td>
                    <td>{item.bos_code}</td>
                    <td>{item.delivery_uom}</td>
                    <td>{item.bos_material_description}</td>
                    <td>{item.bos_uom}</td>
                    <td>{item.first_qty_uom}</td>
                    <td>{item.second_qty_uom}</td>
                    <td>{item.third_qty_uom}</td>
                    <td>{item.source}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ConsolidatedWeeklyOrder;
