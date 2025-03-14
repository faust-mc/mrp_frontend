import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../api"; // Adjust path if needed

function Forecast() {
  const { idofinventory } = useParams();
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/mrp/forecast/${idofinventory}/`);
        setForecast(response.data);
      } catch (error) {
        console.error("Error fetching forecast:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idofinventory]);

  return (
    <div>
      <h2>Forecast Report</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ overflowY: "auto", maxHeight: "calc(100vh - 237px)" }}>
          <table className="table table-striped table-bordered">
            <thead className="table-dark" style={{ position: "sticky", top: 0, backgroundColor: "white",boxShadow: "0px -8px 10px rgba(0, 0, 0, 0.4)" }}>
              <tr>
                <th>BOS Code</th>
                <th>Item Description</th>
                <th>Average Daily Usage</th>
                <th>Days to Last</th>
                <th>Forecast Weekly Consumption</th>
                <th>Forecasted Ending Inventory</th>
                <th>Converted Ending Inventory</th>
                <th>Forecast</th>
              </tr>
            </thead>
            <tbody>
              {forecast.length > 0 ? (
                forecast.map((item) => (
                  <tr key={item.id}>
                    <td>{item.bom_entry__bos_code}</td>
                    <td>{item.bom_entry__bos_material_description}</td>
                    <td>{item.average_daily_usage}</td>
                    <td>{item.days_to_last}</td>
                    <td>{item.forecast_weekly_consumption}</td>
                    <td>{item.forecasted_ending_inventory}</td>
                    <td>{item.converted_ending_inventory}</td>
                    <td>{item.forecast}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">No data found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Forecast;