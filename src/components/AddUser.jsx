// AddEmployeeModal.jsx
import {React,useEffect, useState} from "react";
import { Modal, Button, Form, Row, Col, Table } from "react-bootstrap";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import {jwtDecode} from "jwt-decode";
import api from "../api";
import { ACCESS_TOKEN } from "../constants";


const animatedComponents = makeAnimated();

const AddUser = ({ modalOpen, handleCloseModal, handleSubmit, newEmployee, handleInputChange }) => {

    const [modules, setModules] = useState([]);
    const [areas, setAreas] = useState([]);
    const token = localStorage.getItem(ACCESS_TOKEN);


  const getModules = () => {
    if (token) {
      try {
        const config = {
          headers: { Authorization: `CTGI7a00fn ${token}` },
          withCredentials: true,
        };

        api
          .get(`/mrp/combined-modules/`, config)
          .then((response) => {
            const results = response.data;
            setModules(results);
          })
          .catch((error) => {
            console.error("Error fetching modules", error);
          });
      } catch (error) {
        console.error("Error decoding token", error);
      }
    } else {
      console.error("No access token found");
    }
  };


 const getAreas = () => {
  if (token) {
    try {
      const config = {
        headers: { Authorization: `CTGI7a00fn ${token}` },
        withCredentials: true,
      };

      api
        .get(`/mrp/area-list/`, config)
        .then((response) => {
          const results = response.data;
          
          // Transform the data to the required format
          const areaOptions = results.map((area) => ({
            value: area.location, // 'value' is the location
            label: area.location, // 'label' is also the location
          }));
          
          setAreas(areaOptions); // Set the transformed data to state
        })
        .catch((error) => {
          console.error("Error fetching modules", error);
        });
    } catch (error) {
      console.error("Error decoding token", error);
    }
  } else {
    console.error("No access token found");
  }
};




useEffect(()=>{
    getModules()
    getAreas()
}, [])


   
  return (
    <Modal dialogClassName="custom-modal" show={modalOpen} onHide={handleCloseModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add New Employee</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group controlId="formFirstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="first_name"
                  value={newEmployee.first_name}
                  onChange={handleInputChange}
                  className="wider-field"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formLastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="last_name"
                  value={newEmployee.last_name}
                  onChange={handleInputChange}
                  className="wider-field"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={newEmployee.email}
                  onChange={handleInputChange}
                  className="wider-field"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formDepartment">
                <Form.Label>Department</Form.Label>
                <Form.Control
                  type="text"
                  name="department"
                  value={newEmployee.department}
                  onChange={handleInputChange}
                  className="wider-field"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group controlId="formTelephoneNumber">
                <Form.Label>Telephone Number</Form.Label>
                <Form.Control
                  type="text"
                  name="telephone_number"
                  value={newEmployee.telephone_number}
                  onChange={handleInputChange}
                  className="wider-field"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formMobileNumber">
                <Form.Label>Mobile Number</Form.Label>
                <Form.Control
                  type="text"
                  name="mobile_number"
                  value={newEmployee.mobile_number}
                  onChange={handleInputChange}
                  className="wider-field"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group controlId="formSupervisor">
                <Form.Label>Supervisor</Form.Label>
                <Select />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formRole">
                <Form.Label>Role</Form.Label>
                <Form.Control
                  type="text"
                  name="role"
                  value={newEmployee.role}
                  onChange={handleInputChange}
                  className="wider-field"
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
                <Form.Group controlId="area">
                   <Form.Label>Area</Form.Label>
                  <Select
                      closeMenuOnSelect={false}
                      components={animatedComponents}
                      defaultValue={[]}
                      isMulti
                      options={areas}
                    />
    
              </Form.Group>
            </Col>
          </Row>
       

          <Row>
            <Col>
              <h5>Permissions</h5>
              <Table bordered>
                <thead>
                  <tr>
                    <th>Permission</th>
                    <th>View</th>
                    <th>Add</th>
                    <th>Edit</th>
                    <th>Delete</th>
                    <th>Generate Report</th>
                  </tr>
                </thead>
                <tbody>
                  {modules.map((permission, index) => (
                    <tr key={index}>
                      <td>{permission.components}</td>
                      <td>
                        <Form.Check type="checkbox" onChange={(e) => handlePermissionChange(e, permission, "view")} />
                      </td>
                      <td>
                        <Form.Check type="checkbox" onChange={(e) => handlePermissionChange(e, permission, "add")} />
                      </td>
                      <td>
                        <Form.Check type="checkbox" onChange={(e) => handlePermissionChange(e, permission, "edit")} />
                      </td>
                      <td>
                        <Form.Check type="checkbox" onChange={(e) => handlePermissionChange(e, permission, "delete")} />
                      </td>
                      <td>
                        <Form.Check type="checkbox" onChange={(e) => handlePermissionChange(e, permission, "generate_report")} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>

          <Button variant="primary" type="submit" className="mt-3">
            Add Employee
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddUser;
