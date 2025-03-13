import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";

function ForAdjustment({ setAdjustments, isEditable, numberOfItems,
                            deliveryMultiplier }) {

  const { idofinventory } = useParams();
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adjustmentValues, setAdjustmentValues] = useState({});

   const calculateFinalDelivery = (forecastValue, adjustmentValue, bundlingSize, multiplier) => {

    const totalValue = (forecastValue*multiplier) + adjustmentValue;
    return totalValue >= 0 ? Math.ceil(totalValue / bundlingSize) * bundlingSize : 0;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!idofinventory) return;

        const response = await api.get(`/mrp/forecast/${idofinventory}/`);
        setForecast(response.data);

        const initialAdjustments = {};
        response.data.forEach((item, index) => {
          const conversion = item.bom_entry__conversion_delivery_uom || 1;
          const forecastValue = Math.ceil(item.forecast / conversion);

          initialAdjustments[index] = {
              bom_entry__id: item.bom_entry__id,
              conversion,
              first_adjustment: item.first_adjustment || 0,
              second_adjustment: item.second_adjustment || 0,
              third_adjustment: item.third_adjustment || 0,

              first_final_delivery: item.first_final_delivery || calculateFinalDelivery(forecastValue, item.first_adjustment, item.bom_entry__bundling_size, deliveryMultiplier?.[0] || 1),
              second_final_delivery: item.second_final_delivery || calculateFinalDelivery(forecastValue, item.second_adjustment, item.bom_entry__bundling_size, deliveryMultiplier?.[1] || 0),
              third_final_delivery: item.third_final_delivery || calculateFinalDelivery(forecastValue, item.third_adjustment, item.bom_entry__bundling_size, deliveryMultiplier?.[2] || 0),

              first_qty_delivery: ((item.first_final_delivery || calculateFinalDelivery(forecastValue, item.first_adjustment, item.bom_entry__bundling_size, deliveryMultiplier?.[0] || 1)) * conversion),
              second_qty_delivery: ((item.second_final_delivery || calculateFinalDelivery(forecastValue, item.second_adjustment, item.bom_entry__bundling_size, deliveryMultiplier?.[1] || 0)) * conversion),
              third_qty_delivery: ((item.third_final_delivery || calculateFinalDelivery(forecastValue, item.third_adjustment, item.bom_entry__bundling_size, deliveryMultiplier?.[2] || 0)) * conversion),
            };

        });

        setAdjustmentValues(initialAdjustments);
        setAdjustments(Object.values(initialAdjustments));
      } catch (error) {
        console.error("Error fetching forecast:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idofinventory, setAdjustments, deliveryMultiplier]);



  const handleAdjustmentChange = (e, index, field) => {
  const value = parseFloat(e.target.value) || 0;
  const conversion = adjustmentValues[index]?.conversion || 1;
  const forecastValue = Math.ceil(forecast[index].forecast / conversion);
  const bundlingSize = forecast[index].bom_entry__bundling_size;

  // ✅ Calculate the total adjustment for the row
  const currentFirst = field === "first_adjustment" ? value : adjustmentValues[index]?.first_adjustment || 0;
  const currentSecond = field === "second_adjustment" ? value : adjustmentValues[index]?.second_adjustment || 0;
  const currentThird = field === "third_adjustment" ? value : adjustmentValues[index]?.third_adjustment || 0;

  const totalAdjustment = currentFirst + currentSecond + currentThird;
  const maxAdjustment = Math.ceil(forecastValue * 0.5); // ±50% of forecast

  // ✅ Enforce row-level validation
  if (Math.abs(totalAdjustment) > maxAdjustment) {
    alert(`Total adjustments cannot exceed ±${maxAdjustment}`);
    return;
  }

  setAdjustmentValues((prevValues) => {
    const updatedValues = {
      ...prevValues,
      [index]: {
        ...prevValues[index],
        [field]: value,
        first_final_delivery: calculateFinalDelivery(forecastValue, currentFirst, bundlingSize,deliveryMultiplier[0]),

        second_final_delivery: calculateFinalDelivery(forecastValue, currentSecond, bundlingSize,deliveryMultiplier[1]),

        third_final_delivery: calculateFinalDelivery(forecastValue, currentThird, bundlingSize,deliveryMultiplier[2]),

        first_qty_delivery: calculateFinalDelivery(forecastValue, currentFirst, bundlingSize,deliveryMultiplier[0]) * conversion,

        second_qty_delivery:  calculateFinalDelivery(forecastValue, currentSecond, bundlingSize,deliveryMultiplier[1]) * conversion,

        third_qty_delivery:  calculateFinalDelivery(forecastValue, currentThird, bundlingSize,deliveryMultiplier[2]) * conversion,
      },
    };

    setAdjustments(Object.values(updatedValues));
    return updatedValues;
  });
};




  return (
    <div>
      <h2>For Adjustment</h2>
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
    <th>Converted Weekly Forecast</th>
    <th>1st Forecast</th>

    {numberOfItems >= 1 && (
      <>
        <th>1st Adjustment</th>
        <th>1st Final Delivery</th>
        <th>1st QTY Delivery</th>
      </>
    )}

    {numberOfItems >= 2 && (
      <>
        <th>For 2nd Forecast</th>
        <th>2nd Adjustment</th>
        <th>2nd Final Delivery</th>
        <th>2nd QTY Delivery</th>
      </>
    )}

    {numberOfItems >= 3 && (
      <>
        <th>For 3rd Forecast</th>
        <th>3rd Adjustment</th>
        <th>3rd Final Delivery</th>
        <th>3rd QTY Delivery</th>
      </>
    )}
  </tr>
</thead>

            <tbody>
  {forecast.length > 0 ? (
    forecast.map((item, index) => {
      const adjustedValues = adjustmentValues[index] || {};
      const weekly_forecast = Math.ceil(item.forecast / (adjustedValues.conversion || 1))
      return (
        <tr key={item.id}>
          <td>{item.bom_entry__bos_code}</td>
          <td>{item.bom_entry__bos_material_description}</td>
          <td>{item.bom_entry__bundling_size}</td>
          <td>{adjustedValues.conversion || 1}</td>
          <td>{weekly_forecast}</td>
          <td>{Math.ceil(weekly_forecast * deliveryMultiplier[0])}</td>
          {/* First Adjustment */}
          {numberOfItems >= 1 && (
            <>
              <td>
                <input
                  type="number"
                  value={adjustedValues.first_adjustment || 0}
                  onChange={(e) => handleAdjustmentChange(e, index, "first_adjustment")}
                  style={{ width: "60px" }}
                  readOnly={!isEditable}
                />
              </td>
              <td>
                <input type="number" value={adjustedValues.first_final_delivery || 0} readOnly style={{ width: "60px" }} />
              </td>
              <td>
                <input type="number" value={adjustedValues.first_qty_delivery || 0} readOnly style={{ width: "80px" }} />
              </td>
            </>
          )}

          {/* Second Adjustment (Only if numberOfItems >= 2) */}
          {numberOfItems >= 2 && (
            <>
             <td>{Math.ceil(weekly_forecast * deliveryMultiplier[1])}</td>
              <td>
                <input
                  type="number"
                  value={adjustedValues.second_adjustment || 0}
                  onChange={(e) => handleAdjustmentChange(e, index, "second_adjustment")}
                  style={{ width: "60px" }}
                  readOnly={!isEditable}
                />
              </td>
              <td>
                <input type="number" value={adjustedValues.second_final_delivery || 0} readOnly style={{ width: "60px" }} />
              </td>
              <td>
                <input type="number" value={adjustedValues.second_qty_delivery || 0} readOnly style={{ width: "80px" }} />
              </td>
            </>
          )}

          {/* Third Adjustment (Only if numberOfItems >= 3) */}
          {numberOfItems >= 3 && (
            <>
              <td>
                <input
                  type="number"
                  value={adjustedValues.third_adjustment || 0}
                  onChange={(e) => handleAdjustmentChange(e, index, "third_adjustment")}
                  style={{ width: "60px" }}
                  readOnly={!isEditable}
                />
              </td>
              <td>
                <input type="number" value={adjustedValues.third_final_delivery || 0} readOnly style={{ width: "60px" }} />
              </td>
              <td>
                <input type="number" value={adjustedValues.third_qty_delivery || 0} readOnly style={{ width: "80px" }} />
              </td>
            </>
          )}
        </tr>
      );
    })
  ) : (
    <tr>
      <td colSpan="14" className="text-center">No data found</td>
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
