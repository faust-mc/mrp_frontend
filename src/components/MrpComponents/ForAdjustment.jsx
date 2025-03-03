import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../api"; // Adjust path if needed

function ForAdjustment({forAdjustmentKey, setAdjustments, isEditable }) {

  const { idofinventory } = useParams();
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adjustmentValues, setAdjustmentValues] = useState({});
  const [finalDeliveryValues, setFinalDeliveryValues] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/mrp/forecast/${idofinventory}/`);
        setForecast(response.data);

        const initialAdjustments = {};
        const initialFinalDeliveries = {};
        const adjustmentData = [];

        response.data.forEach((item, index) => {
          const forecastValue = Math.ceil(item.forecast / (item.bom_entry__conversion_delivery_uom || 1));

          // Pre-fill values from API
          const adjustment = item.first_adjustment || 0;
          const finalDelivery = item.first_final_delivery || calculateFinalDelivery(forecastValue, adjustment, item.bom_entry__bundling_size);

          initialAdjustments[index] = adjustment;
          initialFinalDeliveries[index] = finalDelivery;

          adjustmentData.push({
            bom_entry__id: item.bom_entry__id,
            adjustment: adjustment,
            final_delivery: finalDelivery,
          });
        });

        setAdjustmentValues(initialAdjustments);
        setFinalDeliveryValues(initialFinalDeliveries);
        setAdjustments(adjustmentData);
      } catch (error) {
        console.error("Error fetching forecast:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idofinventory, setAdjustments]);

  const calculateFinalDelivery = (forecastValue, adjustmentValue, bundlingSize) => {
    const totalValue = forecastValue + adjustmentValue;
    return totalValue >= 0 ? Math.ceil(totalValue / bundlingSize) * bundlingSize : 0;
  };

  const handleAdjustmentChange = (e, forecastValue, bundlingSize, index, bom_entry__id) => {
      console.log(e.target.value)
      console.log("--1-")
    const adjustmentValue = e.target.value? parseFloat(e.target.value):0;

    if (adjustmentValue > forecastValue / 2) {
      e.target.value = adjustmentValues[index] || 0;
      alert("Adjustment value cannot be more than 50% greater than the forecast value.");
      return;
    }

    const newFinalDelivery = calculateFinalDelivery(forecastValue, adjustmentValue, bundlingSize);

    setAdjustmentValues((prevValues) => ({
      ...prevValues,
      [index]: adjustmentValue,
    }));

    setFinalDeliveryValues((prevValues) => ({
      ...prevValues,
      [index]: newFinalDelivery,
    }));

    setAdjustments((prevAdjustments) => {
      const updatedAdjustments = [...prevAdjustments];
      updatedAdjustments[index] = {
        bom_entry__id,
        adjustment: adjustmentValue,
        final_delivery: newFinalDelivery,
      };
      return updatedAdjustments;
    });
  };

  return (
    <div>
      <h2>Forecast Report</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ overflowY: "auto", maxHeight: "calc(100vh - 238px)" }}>
          <table className="table table-striped table-bordered responsive-table">
            <thead className="table-dark" style={{ position: "sticky", top: 0, backgroundColor: "white", boxShadow: "0px -8px 10px rgba(0, 0, 0, 0.4)" }}>
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
                    <td>{item.bom_entry__conversion_delivery_uom || 1}</td>
                    <td>{item.forecast}</td>
                    <td>{(item.forecast / (item.bom_entry__conversion_delivery_uom || 1)).toFixed(2)}</td>
                    <td>{Math.ceil(item.forecast / (item.bom_entry__conversion_delivery_uom || 1))}</td>
                    <td>
                      <input
                        className="adjustment-input"
                        type="number"
                        value={adjustmentValues[index]? adjustmentValues[index]:0 }
                        onChange={(e) =>
                          handleAdjustmentChange(
                            e,
                            Math.ceil(item.forecast / (item.bom_entry__conversion_delivery_uom || 1)),
                            item.bom_entry__bundling_size,
                            index,
                            item.bom_entry__id
                          )
                        }
                        style={{ width: "60px" }}
                      readOnly={!isEditable}
                      />
                    </td>
                    <td>
                      <input type="number" value={finalDeliveryValues[index]?finalDeliveryValues[index]:0 } readOnly style={{ width: "60px" }} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center">No data found</td>
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
