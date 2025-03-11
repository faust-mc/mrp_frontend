import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../api"; // Adjust path if needed

function ForAdjustment({forAdjustmentKey, setAdjustments, isEditable }) {

  const { idofinventory } = useParams();
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adjustmentValues, setAdjustmentValues] = useState({});
  const [finalDeliveryValues, setFinalDeliveryValues] = useState({});
  const [qtyForDeliveryValues, setQtyForDeliveryValues] = useState({}); // NEW STATE

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/mrp/forecast/${idofinventory}/`);
        setForecast(response.data);

        const initialAdjustments = {};
        const initialFinalDeliveries = {};
        const initialQtyForDelivery = {};
        const adjustmentData = [];

        response.data.forEach((item, index) => {
          const forecastValue = Math.ceil(item.forecast / (item.bom_entry__conversion_delivery_uom || 1));

          //pre-fill values from api
          const adjustment = item.first_adjustment || 0;
          const finalDelivery = item.first_final_delivery || calculateFinalDelivery(forecastValue, adjustment, item.bom_entry__bundling_size);
          const qtyForDelivery = finalDelivery * (item.bom_entry__conversion_delivery_uom || 1);

          initialAdjustments[index] = adjustment;
          initialFinalDeliveries[index] = finalDelivery;
          initialQtyForDelivery[index] = qtyForDelivery;

          adjustmentData.push({
            bom_entry__id: item.bom_entry__id,
            adjustment: adjustment,
            final_delivery: finalDelivery,
            quantity_for_delivery: qtyForDelivery,

          });
        });

        setAdjustmentValues(initialAdjustments);
        setFinalDeliveryValues(initialFinalDeliveries);
        setQtyForDeliveryValues(initialQtyForDelivery);
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

  const handleAdjustmentChange = (e, forecastValue, bundlingSize, index, bom_entry__id, conversion) => {

    const adjustmentValue = e.target.value? parseFloat(e.target.value):0;

    if (adjustmentValue > forecastValue / 2) {
      e.target.value = adjustmentValues[index] || 0;
      alert("Adjustment value cannot be more than 50% greater than the forecast value.");
      return;
    }

    const newFinalDelivery = calculateFinalDelivery(forecastValue, adjustmentValue, bundlingSize);
    const newQtyForDelivery = newFinalDelivery * conversion;

    setAdjustmentValues((prevValues) => ({
      ...prevValues,
      [index]: adjustmentValue,
    }));

    setFinalDeliveryValues((prevValues) => ({
      ...prevValues,
      [index]: newFinalDelivery,
    }));

    setQtyForDeliveryValues((prevValues) => ({
      ...prevValues,
      [index]: newQtyForDelivery,
    }));

    setAdjustments((prevAdjustments) => {
      const updatedAdjustments = [...prevAdjustments];
      updatedAdjustments[index] = {
        bom_entry__id,
        adjustment: adjustmentValue,
        final_delivery: newFinalDelivery,
        quantity_for_delivery: newQtyForDelivery,

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
        <div style={{ overflowY: "auto", maxHeight: "calc(100vh - 239px)" }}>
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
                <th>QTY FOR DELIVERY (BOS UOM)</th>
              </tr>
            </thead>
            <tbody>
              {forecast.length > 0 ? (
                forecast.map((item, index) => {
                  const convertedForecast = Math.ceil(item.forecast / (item.bom_entry__conversion_delivery_uom || 1));
                  const finalDelivery = finalDeliveryValues[index] || 0;
                  const qtyForDelivery = finalDelivery * (item.bom_entry__conversion_delivery_uom || 1); // NEW CALCULATION

                  return (
                    <tr key={item.id}>
                      <td>{item.bom_entry__bos_code}</td>
                      <td>{item.bom_entry__bos_material_description}</td>
                      <td>{item.bom_entry__bundling_size}</td>
                      <td>{item.bom_entry__conversion_delivery_uom || 1}</td>
                      <td>{item.forecast}</td>
                      <td>{(item.forecast / (item.bom_entry__conversion_delivery_uom || 1)).toFixed(2)}</td>
                      <td>{convertedForecast}</td>
                      <td>
                        <input
                          className="adjustment-input"
                          type="number"
                          value={adjustmentValues[index] ? adjustmentValues[index] : 0}
                          onChange={(e) =>
                            handleAdjustmentChange(
                              e,
                              convertedForecast,
                              item.bom_entry__bundling_size,
                              index,
                              item.bom_entry__id,
                              item.bom_entry__conversion_delivery_uom || 1,

                            )
                          }
                          style={{ width: "60px" }}
                          readOnly={!isEditable}
                        />
                      </td>
                      <td>
                        <input type="number" value={finalDelivery} readOnly style={{ width: "60px" }} />
                      </td>
                      <td>
                        <input type="number" value={qtyForDelivery} readOnly style={{ width: "80px" }} /> {/* NEW FIELD */}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="10" className="text-center">No data found</td>
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
