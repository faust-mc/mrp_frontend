import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import Tabs from "../components/MrpComponents/Tabs";
import EndingInventoryTab from "../components/MrpComponents/EndingInventoryTab";
import InitialReplenishmentTab from "../components/MrpComponents/InitialReplenishmentTab";
import ItemSalesTab from "../components/MrpComponents/ItemSalesTab";
import Forecast from "../components/MrpComponents/Forecast";
import ForAdjustment from "../components/MrpComponents/ForAdjustment";
import ByRequest from "../components/MrpComponents/ByRequest";

function Mrp() {
    const { idofinventory } = useParams();
    const [activeTab, setActiveTab] = useState("tab1");
    const [inventoryCode, setInventoryCode] = useState("");

    const tabTitles = {
        tab1: "Ending Inventory",
        tab2: "Initial Replenishment",
        tab3: "Forecast",
        tab4: "Order For Adjustment",
        tab5: "By Request Items",
        tab6: "Items Sales"
    };

    useEffect(() => {

        const fetchInventoryCode = async () => {
            try {
                const response = await api.get(`/mrp/get-inventory-code/${idofinventory}/`);
                const data = await response.data;
                setInventoryCode(data.inventory_code || "Unknown Code");
            } catch (error) {
                console.error("Error fetching inventory code:", error);
                setInventoryCode("Error Fetching Code");
            }
        };
        if (idofinventory) {
            fetchInventoryCode();
        }
    }, [idofinventory]);

    const handleSubmit = () => {
        alert(`Submitting data for ${tabTitles[activeTab]}`);
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>{inventoryCode}</h1>
                <button className="btn btn-sm btn-primary" onClick={handleSubmit}>Submit</button>
            </div>
            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} tabNames={tabTitles} />

            <div className="tab-content p-3 border border-top-0">
                {activeTab === "tab1" && <EndingInventoryTab />}
                {activeTab === "tab2" && <InitialReplenishmentTab />}
                {activeTab === "tab3" && <Forecast />}
                {activeTab === "tab4" && <ForAdjustment />}
                {activeTab === "tab5" && <ByRequest />}
                {activeTab === "tab6" && <ItemSalesTab />}
                {activeTab !== "tab1" && activeTab !== "tab2" && activeTab !== "tab3" && activeTab!== "tab4" && activeTab !== "tab5" && activeTab !== "tab6" && <p>Select a tab to view data.</p>}
            </div>
        </div>
    );
}

export default Mrp;
