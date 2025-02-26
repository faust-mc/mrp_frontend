import { useState } from "react";
import Tabs from "../components/MrpComponents/Tabs";
import EndingInventoryTab from "../components/MrpComponents/EndingInventoryTab";
import InitialReplenishmentTab from "../components/MrpComponents/InitialReplenishmentTab";
import ItemSalesTab from "../components/MrpComponents/ItemSalesTab"; // Import new tab

function Mrp() {
    const [activeTab, setActiveTab] = useState("tab1");

    const tabTitles = {
        tab1: "Ending Inventory",
        tab2: "Initial Replenishment",
        tab3: "Forecast",
        tab4: "Order For Adjustment",
        tab5: "Items Sales" // New tab
    };

    return (
        <div className="container mt-4">
            <h1>{tabTitles[activeTab]}</h1>
            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} tabNames={tabTitles} />

            <div className="tab-content p-3 border border-top-0">
                {activeTab === "tab1" && <EndingInventoryTab />}
                {activeTab === "tab2" && <InitialReplenishmentTab />}
                {activeTab === "tab5" && <ItemSalesTab />} {/* New tab */}
                {activeTab !== "tab1" && activeTab !== "tab2" && activeTab !== "tab5" && <p>Select a tab to view data.</p>}
            </div>
        </div>
    );
}

export default Mrp;
