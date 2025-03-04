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
import { ModuleProvider, useModuleContext } from "../components/ControlComponents/ModuleContext";


function Mrp() {
    const { modules, setModules, accessPermissions, setAccessPermissions } = useModuleContext();
    const { idofinventory } = useParams();
    const [activeTab, setActiveTab] = useState("tab1");
    const [inventoryCode, setInventoryCode] = useState("");
    const [adjustments, setAdjustments] = useState([]);
    const [byRequestItems, setByRequestItems] = useState([]);
    const [isEditable, setIsEditable] = useState(false);
    const [isDraft, setIsDraft] = useState(false);
    const [showSubmit, setShowSubmit] = useState(false);
    const [status, setStatus] = useState(null); // Track status
    const [forAdjustmentKey, setForAdjustmentKey] = useState(0);
    const [refreshKey, setRefreshKey] = useState(0);

    const tabTitles = {
        tab1: "Ending Inventory",
        tab2: "Initial Replenishment",
        tab3: "Forecast",
        tab4: "Order For Adjustment",
        tab5: "By Request Items",
        tab6: "Items Sales"
    };
    console.log(accessPermissions)
    useEffect(() => {
        const fetchInventoryData = async () => {
            try {
                const response = await api.get(`/mrp/get-inventory-code/${idofinventory}/`);
                const { status, inventory_code } = response.data;

                setInventoryCode(inventory_code || "Unknown Code");
                setStatus(status);

                setIsDraft(status < 3);
                setIsEditable(status < 3);
                setShowSubmit(status === 3); // Show submit only when status is 3
            } catch (error) {
                console.error("Error fetching inventory code:", error);
                setInventoryCode("Error Fetching Code");
            }
        };

        if (idofinventory) {
            fetchInventoryData();
        }
    }, [idofinventory, refreshKey]);

    const handleSave = async () => {
        const requestData = {
            adjustment: adjustments,
            by_request_items: byRequestItems
        };

        try {
            if (isDraft) {
                await api.post(`/mrp/request/${idofinventory}/`, requestData);
            } else {
                await api.post(`/mrp/update-request/${idofinventory}/`, requestData);
            }

            alert("Data saved successfully!");
            setIsEditable(false);
            setIsDraft(false);
            setShowSubmit(true);
        } catch (error) {
            console.error("Error submitting data:", error);
            alert("Failed to save data.");
        }
    };

    const handleSubmit = async () => {
        try {
            await api.post(`/mrp/submit/${idofinventory}/`);
            alert("MRP submitted successfully!");
            setShowSubmit(false);
             setRefreshKey(prevKey => prevKey + 1); // Trigger component refresh
        } catch (error) {
            console.error("Error submitting MRP:", error);
            alert("Failed to submit MRP.");
        }
    };

    const handleApprove = async () => {
        try {
            await api.post(`/mrp/approve/${idofinventory}/`);
            alert("MRP approved successfully!");
        } catch (error) {
            console.error("Error approving MRP:", error);
            alert("Failed to approve MRP.");
        }
    };

    const handleReturnForAmendment = async () => {
        try {
            await api.post(`/mrp/return-for-amendment/${idofinventory}/`);
            alert("MRP returned for amendment!");
        } catch (error) {
            console.error("Error returning MRP for amendment:", error);
            alert("Failed to return for amendment.");
        }
    };

    const handleCancelEdit = () => {
        setForAdjustmentKey((prevKey) => prevKey + 1);
        setIsEditable(false);
        setShowSubmit(status === 3); // Restore Submit button if status is 3
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>{inventoryCode}</h1>
                <div>
                    {isEditable ? (
                        <>
                            <button className="btn btn-sm btn-primary me-2" onClick={handleSave}>
                                Save
                            </button>
                            <button className="btn btn-sm btn-danger" onClick={handleCancelEdit}>
                                Cancel
                            </button>
                        </>
                    ) : (
                        <>
                            {status < 4 && (
                                <button className="btn btn-sm btn-secondary me-2" onClick={() => setIsEditable(true)}>
                                    Edit
                                </button>
                            )}
                            {showSubmit && (
                                <button className="btn btn-sm btn-success me-2" onClick={handleSubmit}>
                                    Submit
                                </button>
                            )}
                            {status === 4 && (
                                <>
                                    <button className="btn btn-sm btn-success me-2" onClick={handleApprove}>
                                        Approve
                                    </button>
                                    <button className="btn btn-sm btn-warning" onClick={handleReturnForAmendment}>
                                        Return for Amendment
                                    </button>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>

            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} tabNames={tabTitles} />

            <div className="tab-content p-3 border border-top-0">
                {activeTab === "tab1" && <EndingInventoryTab />}
                {activeTab === "tab2" && <InitialReplenishmentTab />}
                {activeTab === "tab3" && <Forecast />}
                {activeTab === "tab4" && <ForAdjustment key={forAdjustmentKey} setAdjustments={setAdjustments} isEditable={isEditable} />}
                {activeTab === "tab5" && <ByRequest key={forAdjustmentKey} setByRequestItems={setByRequestItems} isEditable={isEditable} />}
                {activeTab === "tab6" && <ItemSalesTab />}
                {!Object.keys(tabTitles).includes(activeTab) && <p>Select a tab to view data.</p>}
            </div>
        </div>
    );
}

export default Mrp;
