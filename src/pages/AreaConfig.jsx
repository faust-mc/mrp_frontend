import { useState, useEffect } from "react";
import { Modal, Button, Table, Form } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import api from "../api"; // Ensure this is the correct path

function AreaConfig() {
    const [variables, setVariables] = useState([]);
    const [areas, setAreas] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        area: "",
        number_of_days: "",
        seasonality_index: "",
        days_of_consumption: "",
        safety_stock: "",
        ndbd: "",
        number_of_request: 1,
        number_of_items: 1,
        first_delivery_multiplier : 1,
	    second_delivery_multiplier : 0,
	    third_delivery_multiplier : 0

    });
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchVariables();
        fetchAreas();
    }, []);

    const fetchVariables = async () => {
        try {
            const response = await api.get("mrp/user-defined-variables/");
            console.log(response)
            console.log("response----")
            setVariables(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const fetchAreas = async () => {
        try {
            const response = await api.get("mrp/area-list/");
            setAreas(response.data);
        } catch (error) {
            console.error("Error fetching areas:", error);
        }
    };

    const handleChange = (e) => {
        let { name, value } = e.target;
        if (name === "number_of_request") {
        value = Math.min(3, parseInt(value) || 1); // Limit to max 3
        }
       setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
        area: formData.area ? parseInt(formData.area) : null, // ✅ Ensure it's an integer
        number_of_days: formData.number_of_days,
        seasonality_index: formData.seasonality_index,
        days_of_consumption: formData.days_of_consumption,
        safety_stock: formData.safety_stock,
        ndbd: formData.ndbd,
        number_of_request: formData.number_of_request,
        number_of_items: formData.number_of_items,
        first_delivery_multiplier : formData.first_delivery_multiplier,
	    second_delivery_multiplier : formData.second_delivery_multiplier,
	    third_delivery_multiplier : formData.third_delivery_multiplier
    };

    console.log("Submitting Data:", payload);  // 🔍 Debugging
    console.log(payload)
    console.log("payload--")
    try {
        if (isEditing) {
            console.log
            await api.put(`mrp/user-defined-variables/${editId}/`, payload);
        } else {
            await api.post("mrp/user-defined-variables/", payload);
        }
        fetchVariables();
        handleCloseModal();
    } catch (error) {
        console.error("Error saving data:", error.response?.data || error);
    }
};


    const handleEdit = (variable) => {
    setFormData({
        area: variable.area ? variable.area.id : "",  // ✅ Store only the area ID
        number_of_days: variable.number_of_days,
        seasonality_index: variable.seasonality_index,
        days_of_consumption: variable.days_of_consumption,
        safety_stock: variable.safety_stock,
        ndbd: variable.ndbd,
        number_of_request: variable.number_of_request,
        number_of_items: variable.number_of_items,
        first_delivery_multiplier : variable.first_delivery_multiplier,
	    second_delivery_multiplier : variable.second_delivery_multiplier,
	    third_delivery_multiplier : variable.third_delivery_multiplier
    });
    setEditId(variable.id);
    setIsEditing(true);
    setShowModal(true);
};


    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this entry?")) {
            try {
                await api.delete(`mrp/user-defined-variables/${id}/`);
                fetchVariables();
            } catch (error) {
                console.error("Error deleting data:", error);
            }
        }
    };

    const handleShowModal = () => {
        setFormData({
            area: "",
            number_of_days: "",
            seasonality_index: "",
            days_of_consumption: "",
            safety_stock: "",
            ndbd: "",
            number_of_request: 1,
            number_of_items: 1,
            first_delivery_multiplier : 1,
            second_delivery_multiplier : 0,
            third_delivery_multiplier : 0
            });
        setIsEditing(false);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setIsEditing(false);
        setEditId(null);
    };

    return (
        <div className="container mt-4">
            <h1 className="text-center">📊 User Defined Variables</h1>

            {/* Add Button */}
            <div className="d-flex justify-content-end mb-3">
                <Button variant="primary" onClick={handleShowModal}>
                    ➕ Add Variable
                </Button>
            </div>

            {/* Table */}
            <Table striped bordered hover responsive>
                <thead className="table-dark">
                    <tr>
                        <th>Area</th>
                        <th>Number of Days</th>
                        <th>Seasonality Index</th>
                        <th>Days of Consumption</th>
                        <th>Safety Stock</th>
                        <th>NDBD</th>
                        <th>NO. of Requests(BR)</th>
                        <th>NO. of Requests</th>
                        <th>1st Del. Multiplier</th>
                        <th>2nd Del. Multiplier</th>
                        <th>3rd Del. Multiplier</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {variables.length > 0 ? (
                        variables.map((variable) => (
                            <tr key={variable.id}>
                                <td>{variable.area ? areas.find((area) => area.id === variable.area)?.location || "N/A" : "N/A"}</td>

                                <td>{variable.number_of_days}</td>
                                <td>{variable.seasonality_index}</td>
                                <td>{variable.days_of_consumption}</td>
                                <td>{variable.safety_stock}</td>
                                <td>{variable.ndbd}</td>
                                <td>{variable.number_of_request}</td>
                                <td>{variable.number_of_items}</td>
                                <td>{variable.first_delivery_multiplier}</td>
                                <td>{variable.second_delivery_multiplier}</td>
                                <td>{variable.third_delivery_multiplier}</td>
                                <td>
                                    <Button variant="warning" className="me-2" onClick={() => handleEdit(variable)}>
                                        <FaEdit /> Edit
                                    </Button>
                                    <Button variant="danger" onClick={() => handleDelete(variable.id)}>
                                        <FaTrash /> Delete
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className="text-center text-muted">No data available</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {/* Modal for Add/Edit */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? "Edit Variable" : "Add New Variable"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Area</Form.Label>

                                <Form.Select
                                    name="area"
                                    value={formData.area}
                                    onChange={(e) => setFormData({ ...formData, area: parseInt(e.target.value) })}
                                    required
                                >
                                    <option value="">Select Area</option>
                                    {areas.map((area) => (
                                        <option key={area.id} value={area.id}>
                                            {area.location}
                                        </option>
                                    ))}
                                </Form.Select>



                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Number of Days</Form.Label>
                            <Form.Control type="number" name="number_of_days" value={formData.number_of_days} onChange={handleChange} required />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Seasonality Index</Form.Label>
                            <Form.Control type="number" name="seasonality_index" value={formData.seasonality_index} onChange={handleChange} required />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Days of Consumption</Form.Label>
                            <Form.Control type="number" name="days_of_consumption" value={formData.days_of_consumption} onChange={handleChange} required />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Safety Stock</Form.Label>
                            <Form.Control type="number" name="safety_stock" value={formData.safety_stock} onChange={handleChange} required />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>NDBD</Form.Label>
                            <Form.Control type="number" name="ndbd" value={formData.ndbd} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>NO. of Days of Delivery(BR)</Form.Label>
                            <Form.Control type="number" name="number_of_request" value={formData.number_of_request} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>NO. of Days of Delivery</Form.Label>
                            <Form.Control type="number" name="number_of_items" value={formData.number_of_items} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>1st Delivey Multiplier</Form.Label>
                            <Form.Control type="number" name="first_delivery_multiplier" value={formData.first_delivery_multiplier} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>2nd Delivey Multiplier</Form.Label>
                            <Form.Control type="number" name="second_delivery_multiplier" value={formData.second_delivery_multiplier} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>3rd Delivey Multiplier</Form.Label>
                            <Form.Control type="number" name="third_delivery_multiplier" value={formData.third_delivery_multiplier} onChange={handleChange} required />
                        </Form.Group>

                        <div className="d-flex justify-content-end">
                            <Button variant="secondary" onClick={handleCloseModal} className="me-2">
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit">
                                {isEditing ? "Update" : "Add"}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}


export default AreaConfig;
