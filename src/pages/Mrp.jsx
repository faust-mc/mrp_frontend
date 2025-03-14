import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import Tabs from "../components/MrpComponents/Tabs";
import EndingInventoryTab from "../components/MrpComponents/EndingInventoryTab";
import InitialReplenishmentTab from "../components/MrpComponents/InitialReplenishmentTab";
import ItemSalesTab from "../components/MrpComponents/ItemSalesTab";
import Forecast from "../components/MrpComponents/Forecast";
import ApprovedAdjustment from "../components/MrpComponents/ApprovedAdjustment";

import ForAdjustment from "../components/MrpComponents/ForAdjustment";
import ApprovedByRequest from "../components/MrpComponents/ApprovedByRequest";
import ByRequest from "../components/MrpComponents/ByRequest";
import ConsolidatedWeeklyOrder from "../components/MrpComponents/ConsolidatedWeeklyOrder";
import { ModuleProvider, useModuleContext } from "../components/ControlComponents/ModuleContext";


function Mrp() {
    const { modules, setModules, accessPermissions, setAccessPermissions } = useModuleContext();
    const { idofinventory } = useParams();
    const [loading, setLoading] = useState(true);
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
    const [numberOfRequest, setNumberOfRequest] = useState(0);
    const [approvedDate, setApprovedDate] = useState(null);
    const [numberOfItems, setNumberOfItems] = useState(0);
    const [deliveryMultiplier, setDeliveryMultiplier] = useState(null)


    const tabTitles = {
        tab1: status?.status > 4 ? "Approved Adjustment":"Order For Adjustment",
        tab2: status?.status > 4 ? "Approved By Request Items":"By Request Items",
        tab3: "Forecast",
        tab4: "Ending Inventory",
        tab5: "Initial Replenishment",
        tab6: "Items Sales",
        ...(status?.status > 4 && { tab7: "Consolidated Weekly Order" })
    };

    useEffect(() => {
        const fetchInventoryData = async () => {
            try {
                const response = await api.get(`/mrp/get-inventory-code/${idofinventory}/`);
                console.log(response)
                const { status, inventory_code,  number_of_request, number_of_items, delivery_multiplier, approved_at} = response.data;

                setInventoryCode(inventory_code || "Unknown Code");
                setStatus(status);
                setNumberOfRequest(number_of_request || 1);
                setNumberOfItems(number_of_items || 1);
                setDeliveryMultiplier(delivery_multiplier ?? [1, 0, 0]);
                setApprovedDate(approved_at);



                setIsDraft(status.status < 3);
                setIsEditable(status.status < 3);
                setShowSubmit(status.status === 3); // Show submit only when status is 3
            } catch (error) {
                console.error("Error fetching inventory code:", error);
                setInventoryCode("Error Fetching Code");
            }
        };

        if (idofinventory) {
            fetchInventoryData();
        }
    }, [idofinventory, refreshKey]);


    useEffect(() => {
    const fetchByRequestItems = async () => {
      try {
        if (!idofinventory) return;

        const response = await api.get(`/mrp/by_request_items/${idofinventory}/`);
        const items = response.data;

        // Initialize default values for delivery
        const initialDeliveries = items.map((item) => {
          const conversion = item.by_request_item?.conversion || item.conversion || 1;
          return {
            by_request_item: item.by_request_item?.id || item.id,
            category: item.by_request_item?.category || item.category,
            bos_code: item.by_request_item?.bos_code || item.bos_code,
            bos_material_description: item.by_request_item?.bos_material_description || item.bos_material_description,
            conversion,
            first_delivery: item.first_delivery || 0,
            second_delivery: item.second_delivery || 0,
            third_delivery: item.third_delivery || 0,
            first_qty_delivery: (item.first_delivery || 0) * conversion,
            second_qty_delivery: (item.second_delivery || 0) * conversion,
            third_qty_delivery: (item.third_delivery || 0) * conversion,
          };
        });

        setByRequestItems(initialDeliveries);
      } catch (error) {
        console.error("Error fetching ByRequest items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchByRequestItems();
  }, [idofinventory, refreshKey]);



    const handleSave = async () => {

        let editMessage = "";

        if (status?.status === 5) {
            editMessage = prompt("Enter details about the changes made:");
            if (!editMessage) {
                alert("You must provide details about the changes.");
                return;
            }
        }
        const requestData = {
            adjustment: adjustments,
            by_request_items: byRequestItems,
            number_of_request:numberOfRequest,
            number_of_items:numberOfItems,
            ...(status?.status === 5 && { edit_message: editMessage })
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
            setRefreshKey(prevKey => prevKey + 1);
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
             setRefreshKey(prevKey => prevKey + 1);
        } catch (error) {
            console.error("Error submitting MRP:", error);
            alert("Failed to submit MRP.");
        }
    };

    const handleApprove = async () => {
        try {
            await api.post(`/mrp/approve/${idofinventory}/`);
            alert("MRP approved successfully!");
              setRefreshKey(prevKey => prevKey + 1);
        } catch (error) {
            console.error("Error approving MRP:", error);
            alert("Failed to approve MRP.");
        }
    };

    const handleReturnForAmendment = async () => {
    const message = prompt("Enter reason for amendment:");

    if (!message) {
        alert("You must provide a reason.");
        return;
    }

    try {
        await api.post(`/mrp/ammend/${idofinventory}/`, { message });
        alert("MRP returned for amendment!");
           setRefreshKey(prevKey => prevKey + 1);
    } catch (error) {
        console.error("Error returning MRP for amendment:", error);
        alert("Failed to return for amendment.");
    }
};


    const handleCancelEdit = () => {
        setForAdjustmentKey((prevKey) => prevKey + 1);
        setIsEditable(false);
        setShowSubmit(status.status === 3); // Restore Submit button if status is 3
    };
    const canModifyInventory = accessPermissions.some(permission =>
    permission.codename === "add_inventory" || permission.codename === "edit_inventory"
    );
    const canApproveInventory =  accessPermissions.some(permission =>
        permission.codename === "approve_inventory"
    );
    const userCanEdit = isEditable && canModifyInventory;

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center">
                    <h1 className="mb-0">{inventoryCode}</h1>
                    <span className="fw-bold fs-6 badge bg-info ms-2">
                        {status ? status.status_description : "None"}
                    </span>
                    {status?.status === 5 && (<span className="ms-2">

                            <a href={`http://localhost:5173/media/sales/CHOOKS_FARMERS_PLAZA_20250310_sales_report.xlsx`} className="btn btn-sm btn-primary" download>
                                ⬇ Download
                            </a>

                    </span>)}
                </div>


        {status?.status !== 1 && (
            <div>
                {isEditable ? (
                    <>
                        {canModifyInventory && (
                            <>
                                <button className="btn btn-sm btn-primary me-2" onClick={handleSave}>
                                    Save
                                </button>
                                <button className="btn btn-sm btn-danger" onClick={handleCancelEdit}>
                                    Cancel
                                </button>
                            </>
                        )}
                    </>
                ) : (
            <>
                {status?.status < 4 && canModifyInventory && ( // Show Edit button only if user can modify
                    <button className="btn btn-sm btn-secondary me-2" onClick={() => setIsEditable(true)}>
                        Edit
                    </button>
                )}
                {showSubmit && canModifyInventory && (
                    <button className="btn btn-sm btn-success me-2" onClick={handleSubmit}>
                        Submit
                    </button>
                )}
                {status?.status === 4 && canApproveInventory && (
                    <>
                        <button className="btn btn-sm btn-success me-2" onClick={handleApprove}>
                            Approve
                        </button>
                        <button className="btn btn-sm btn-warning" onClick={handleReturnForAmendment}>
                            Return for Amendment
                        </button>
                    </>
                )}
                {status?.status === 5 && canModifyInventory && approvedDate && (() => {
                    const currentDate = new Date();
                    const approvedDeadline = new Date(approvedDate);
                    const limitDays = Math.max(numberOfRequest, numberOfItems);


                    approvedDeadline.setDate(approvedDeadline.getDate() + limitDays + 1);
                    approvedDeadline.setHours(22, 0, 0, 0);


                    return currentDate <= approvedDeadline ? (
                        <button className="btn btn-sm btn-warning me-2" onClick={() => setIsEditable(true)}>
                            Emergency Adjustment
                        </button>
                    ) : null;
                })()}


                        </>
                    )}
                </div>
            )}


            </div>

            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} tabNames={tabTitles} />

            <div className="tab-content p-3 border border-top-0">
               {activeTab === "tab1" && (
                    status?.status > 4 ? (
                        <ApprovedAdjustment
                         key={forAdjustmentKey}
                            setAdjustments={setAdjustments}
                            isEditable={userCanEdit}

                            numberOfItems={numberOfItems}
                            deliveryMultiplier={deliveryMultiplier?deliveryMultiplier:[1,0,0]}
                            approvedDate={approvedDate}
                         />
                    ) : (
                        <ForAdjustment
                            key={forAdjustmentKey}
                            setAdjustments={setAdjustments}
                            isEditable={userCanEdit}

                            numberOfItems={numberOfItems}
                            deliveryMultiplier={deliveryMultiplier?deliveryMultiplier:[1,0,0]}


                        />
                    )
                )}


                {activeTab === "tab2" && (
                     status?.status > 4 ? (
                        <ApprovedByRequest
                    key={forAdjustmentKey}
                    byRequestItems={byRequestItems}
                    setByRequestItems={setByRequestItems}
                    loading = {loading}
                    setLoading = {setLoading}
                    isEditable={isEditable}
                     numberOfRequest={numberOfRequest}
                      approvedDate={approvedDate}
                    />
                    ) : (
                        <ByRequest
                    key={forAdjustmentKey}
                    byRequestItems={byRequestItems}
                    setByRequestItems={setByRequestItems}
                    loading = {loading}
                    setLoading = {setLoading}
                    isEditable={isEditable}
                     numberOfRequest={numberOfRequest}
                    />
                    )
                    )}


                {activeTab === "tab3" && <Forecast />}
                {activeTab === "tab4" && <EndingInventoryTab />}
                {activeTab === "tab5" && <InitialReplenishmentTab />}
                {activeTab === "tab6" && <ItemSalesTab />}
                {activeTab === "tab7" && <ConsolidatedWeeklyOrder/>}
                {!Object.keys(tabTitles).includes(activeTab) && <p>Select a tab to view data.</p>}
            </div>
        </div>
    );
}

export default Mrp;


