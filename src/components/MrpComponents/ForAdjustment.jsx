import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../api"; // Adjust path if needed

function ForAdjustment() {
  const { idofinventory } = useParams();
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adjustmentValues, setAdjustmentValues] = useState({});
  const [finalDeliveryValues, setFinalDeliveryValues] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/mrp/forecast/${idofinventory}/`);
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
      <h2>Forecast Report</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ overflowY: "auto", maxHeight: "calc(100vh - 238px)" }}>
          <table className="table table-striped table-bordered responsive-table" >

            <thead className="table-dark" style={{ position: "sticky", top: 0, backgroundColor: "white",boxShadow: "0px -8px 10px rgba(0, 0, 0, 0.4)" }}>
              <tr>
                <th>BOS Code</th>
                <th>Item Description</th>
                <th>Bundling</th>
                <th>Conversion</th>
                <th>Forecasted Weekly Order</th>
                <th>Converted Forecast</th>
                <th>Forecast</th>
                <th>Adjustment</th>
                <th>For Final Delivery</th>
              </tr>
            </thead>
            <tbody>
              {forecast.length > 0 ? (
                forecast.map((item, index) => (
                  <tr key={item.id}>
                    <td>{item.bom_entry__bos_code}</td>
                    <td>{item.bom_entry__bos_material_description}</td>
                    <td>{item.bom_entry__bundling_size}</td>
                    <td>{item.bom_entry__conversion_delivery_uom? item.bom_entry__conversion_delivery_uom:1}</td>
                    <td>{item.forecast}</td>
                    <td>{(item.forecast / item.bom_entry__conversion_delivery_uom).toFixed(2)}</td>
                    <td>{Math.ceil(item.forecast / item.bom_entry__conversion_delivery_uom)}</td>
                    <td>
                      <input
                        className="adjustment-input"
                        type="number"
                        value={adjustmentValues[index]}
                        onChange={(e) => handleAdjustmentChange(e, Math.ceil(item.forecast / item.bom_entry__conversion_delivery_uom), item.bom_entry__bundling_size, index)}
                       style={{ width: "60px" }}  />
                    </td>
                    <td>
                      <input type="number" value={finalDeliveryValues[index]} readOnly  style={{ width: "60px" }} />
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

export default ForAdjustment;
