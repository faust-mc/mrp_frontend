import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../api"; // Adjust path if needed

function ByRequest() {
  const { idofinventory } = useParams();
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adjustmentValues, setAdjustmentValues] = useState({});
  const [finalDeliveryValues, setFinalDeliveryValues] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/mrp/by_request_items/`);
        console.log(response);
        setForecast(response.data);

        
        const initialAdjustments = {};
        const initialFinalDeliveries = {};

        response.data.forEach((item, index) => {
          initialAdjustments[index] = 0; // Default adjustment to 0
          initialFinalDeliveries[index] = calculateFinalDelivery(Math.ceil(item.forecast / item.bom_entry__conversion_delivery_uom), 0, item.bom_entry__bundling_size);
        });

        setAdjustmentValues(initialAdjustments);
        setFinalDeliveryValues(initialFinalDeliveries);
      } catch (error) {
        console.error("Error fetching forecast:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idofinventory]);

  const calculateFinalDelivery = (forecastValue, adjustmentValue, bundlingSize) => {
      console.log(adjustmentValue)
      console.log("adjustmentValue")
      console.log(bundlingSize)
    const totalValue = forecastValue + adjustmentValue;
    if (totalValue >= 0) {
      return Math.ceil(totalValue / bundlingSize) * bundlingSize;
    }
    return 0;
  };

  const handleAdjustmentChange = (e, forecastValue, bundlingSize, index) => {
    const adjustmentValue = parseFloat(e.target.value) || 0;

    if (adjustmentValue > forecastValue / 2) {
      e.target.value = adjustmentValues[index] || 0; // Revert to previous value
      alert("Adjustment value cannot be more than 50% greater than the forecast value.");
      return;
    }

    setAdjustmentValues((prevValues) => ({
      ...prevValues,
      [index]: adjustmentValue
    }));

    setFinalDeliveryValues((prevValues) => ({
      ...prevValues,
      [index]: calculateFinalDelivery(forecastValue, adjustmentValue, bundlingSize)
    }));
  };

  return (
    <div>
{/*       <h2>Forecast Report</h2> */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ overflowY: "auto", maxHeight: "calc(100vh - 230px)" }}>
          <table className="table table-striped table-bordered responsive-table" >

            <thead className="table-dark" style={{ position: "sticky", top: 0, backgroundColor: "white" }}>
              <tr>
                <th>Category</th>
                <th>BOS Code</th>
                <th>Item Description</th>
                <th>BOS UOM</th>
                <th>Delivery UOM</th>
                <th>Total Weekly Request</th>
              </tr>
            </thead>
            <tbody>
              {forecast.length > 0 ? (
                forecast.map((item, index) => (
                  <tr key={item.id}>
                    <td>{item.category}</td>
                    <td>{item.bos_code}</td>
                    <td>{item.bos_material_description}</td>
                    <td>{item.bos_uom}</td>
                    <td>{item.delivery_uom}</td>



                    <td>
                      <input
                        className="adjustment-input"
                        type="number"
                        value={adjustmentValues[index]}
                        onChange={(e) => handleAdjustmentChange(e, Math.ceil(item.forecast / item.bom_entry__conversion_delivery_uom), item.bom_entry__bundling_size, index)}
                         />
                    </td>

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

export default ByRequest;
