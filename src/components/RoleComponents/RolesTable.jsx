import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faUndo,
  faToggleOn,
  faSync,
  faCopy,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { Modal, Button, Form } from "react-bootstrap";

function RolesTable({ data, tableRef, hasMore, RolesTable, handleOpenModal }) {

  const [isResponsive, setIsResponsive] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "" });
  const [currentPage, setCurrentPage] = useState(1); // State to keep track of the current page
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({});
  const handleEditClick = (row) => {
    setEditData(row);
    setShowEditModal(true);
  };


  const handleCloseModal = () => setShowEditModal(false);


  const handleSaveChanges = () => {

    setShowEditModal(false);
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="table-responsive1">
      <table
        ref={tableRef} // Attach the ref to the table
        id="dataTable"
        className="table table-hover table-striped"
      >
        <thead className="thead-dark">
          <tr>
            <th scope="col" style={{ cursor: "pointer" }}>
              Role Name
            </th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{row.role}</td>
              <td>
                <div className="d-flex justify-content-center">
                  <FontAwesomeIcon
                    icon={faEdit}
                    title="Edit"
                    className="action-icon"
                    onClick={() => handleOpenModal(row.id)}
                    style={{ cursor: "pointer" }}
                  />
                  <FontAwesomeIcon
                    icon={faUndo}
                    title="Return"
                    className="action-icon"
                  />
                  <FontAwesomeIcon
                    icon={faToggleOn}
                    title="Toggle"
                    className="action-icon"
                  />
                  <FontAwesomeIcon
                    icon={faSync}
                    title="Refresh"
                    className="action-icon"
                  />
                  <FontAwesomeIcon
                    icon={faCopy}
                    title="Copy"
                    className="action-icon"
                  />
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    title="Email"
                    className="action-icon"
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={handleCloseModal} size="xl" centered>
  <Modal.Header closeButton>
    <Modal.Title>Edit Role</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      <Form.Group controlId="roleName">
        <Form.Label>Role Name</Form.Label>
        <Form.Control
          type="text"
          name="role"
          value={editData.role || ""}
          onChange={handleInputChange}
        />
      </Form.Group>
      {/* Add more fields here as needed */}
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleCloseModal}>
      Close
    </Button>
    <Button variant="primary" onClick={handleSaveChanges}>
      Save Changes
    </Button>
  </Modal.Footer>
</Modal>


    </div>
  );
}

export default RolesTable;
