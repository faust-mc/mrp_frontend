import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";

function ByRequest({ setByRequestItems, isEditable }) {
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deliveryValues, setDeliveryValues] = useState({});
  const { idofinventory } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!idofinventory) return;

        const itemsResponse = await api.get(`/mrp/by_request_items/${idofinventory}/`);
        setForecast(itemsResponse.data);

        // Initialize delivery values with fetched data
        const initialDeliveries = {};
        itemsResponse.data.forEach((item, index) => {
          const conversion = item.by_request_item?.conversion || item.conversion || 1; // Default to 1 if missing
          initialDeliveries[index] = {
            by_request_item: item.by_request_item?.id || item.id,
            conversion,
            first_delivery: item.first_delivery || 0,
            second_delivery: item.second_delivery || 0,
            third_delivery: item.third_delivery || 0,
            first_qty_delivery: (item.first_delivery || 0) * conversion,
            second_qty_delivery: (item.second_delivery || 0) * conversion,
            third_qty_delivery: (item.third_delivery || 0) * conversion,
          };
        });

        setDeliveryValues(initialDeliveries);
        setByRequestItems(Object.values(initialDeliveries));
      } catch (error) {
        console.error("Error fetching ByRequest items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idofinventory]);

  const handleDeliveryChange = (e, index, type) => {
  const value = parseFloat(e.target.value) || 0;

  setDeliveryValues((prevValues) => {
    const conversion = prevValues[index]?.conversion || 1;
    const updatedValues = {
      ...prevValues,
      [index]: {
        ...prevValues[index],
        [type]: value,
        ...(type === "first_delivery" && { first_qty_delivery: value ? value * conversion : 0 }),
        ...(type === "second_delivery" && { second_qty_delivery: value ? value * conversion : 0 }),
        ...(type === "third_delivery" && { third_qty_delivery: value ? value * conversion : 0 }),
      },
    };
    setByRequestItems(Object.values(updatedValues));
    return updatedValues;
  });
};

  return (
    <div>
      <h2>By Request Items</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ overflowY: "auto", maxHeight: "calc(100vh - 238px)" }}>
          <table className="table table-striped table-bordered responsive-table">
            <thead className="table-dark" style={{ position: "sticky", top: 0, backgroundColor: "white", boxShadow: "0px -8px 10px rgba(0, 0, 0, 0.4)" }}>
              <tr>
                <th>Category</th>
                <th>BOS Code</th>
                <th>Item Description</th>
                <th>Conversion</th>
                <th>First Delivery</th>
                <th>First QTY Delivery</th>
                <th>Second Delivery</th>
                <th>Second QTY Delivery</th>
                <th>Third Delivery</th>
                <th>Third QTY Delivery</th>
              </tr>
            </thead>
            <tbody>
              {forecast.map((item, index) => (
                <tr key={item.id}>
                  <td>{item.by_request_item?.category || item.category}</td>
                  <td>{item.by_request_item?.bos_code || item.bos_code}</td>
                  <td>{item.by_request_item?.bos_material_description || item.bos_material_description}</td>
                  <td>{deliveryValues[index]?.conversion || 1}</td>
                  <td>
                    <input
                      type="number"
                      value={deliveryValues[index]?.first_delivery || 0}
                      onChange={(e) => handleDeliveryChange(e, index, "first_delivery")}
                      readOnly={!isEditable}
                      style={{ width: "50px" }}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={deliveryValues[index]?.first_qty_delivery || 0}
                      readOnly
                      style={{ width: "50px", backgroundColor: "#f0f0f0" }}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={deliveryValues[index]?.second_delivery || 0}
                      onChange={(e) => handleDeliveryChange(e, index, "second_delivery")}
                      readOnly={!isEditable}
                      style={{ width: "50px" }}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={deliveryValues[index]?.second_qty_delivery || 0}
                      readOnly
                      style={{ width: "50px", backgroundColor: "#f0f0f0" }}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={deliveryValues[index]?.third_delivery || 0}
                      onChange={(e) => handleDeliveryChange(e, index, "third_delivery")}
                      readOnly={!isEditable}
                      style={{ width: "50px" }}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={deliveryValues[index]?.third_qty_delivery || 0}
                      readOnly
                      style={{ width: "50px", backgroundColor: "#f0f0f0" }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ByRequest;
