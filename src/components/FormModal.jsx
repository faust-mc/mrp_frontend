// AddEmployeeModal.jsx
import {React,useEffect, useState} from "react";
import { Modal, Button, Form, Row, Col, Table } from "react-bootstrap";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import {jwtDecode} from "jwt-decode";
import api from "../api";
import { ACCESS_TOKEN } from "../constants";


const animatedComponents = makeAnimated();



const FormModal = ({ modalOpen, handleCloseModal, handleSubmit, newData, handleInputChange, setNewData, buttonLabel,compo }) => {

    const [modules, setModules] = useState([]);
    const [areas, setAreas] = useState([]);
    const [roles, setRoles] = useState([]);
    const [departments, setDepartments] = useState([])
    const [supervisors, setSupervisors] = useState([])
    const token = localStorage.getItem(ACCESS_TOKEN);


  const getCheckedRows = () => {
  const checkedComponents = [];
  const tbody = document.getElementById("component_rows");
  const rows = tbody.getElementsByTagName("tr");

  for (let row of rows) {
    const checkboxes = row.querySelectorAll("input[type='checkbox']");
    if (Array.from(checkboxes).some((checkbox) => checkbox.checked)) {
      const component = row.querySelector("td").innerText; // Get the first <td>'s text
      checkedComponents.push(component);
    }
  }

  return checkedComponents;
};



const handlePermissionChange = (e, permission, action) => {
    newData.modules = getCheckedRows()
    const updatedPermissions = { ...newData.permissions };

    if (!updatedPermissions[permission.name]) {
      updatedPermissions[permission.codename] = {};
    }
    updatedPermissions[permission.name][action] = e.target.checked;
    setNewData({ ...newData, permissions: updatedPermissions });
  };


const handleChangeArea = (e, value) => {
  console.log(value);
}

  const getModules = () => {

      try {
        api
          .get(`/mrp/for-forms/`)
          .then((response) => {
            const results = response.data;

            setModules(results.modules);
            const areaOptions = results.areas.map((area) => ({
              value: area.location, // 'value' is the location
              label: area.location,
               id: area.id
            }));
            const roleOptions = results.roles.map((role) => ({
              value: role.role,
              label: role.role,
              id: role.id
            }));

            setAreas(areaOptions);
            setRoles(roleOptions);
            setDepartments(results.departments);
            setSupervisors(results.supervisors);
          })
          .catch((error) => {
            console.error("Error fetching modules", error);
          });
      } catch (error) {
        console.error("Error decoding token", error);
      }
  };

useEffect(()=>{
    getModules()

}, [])



  return (
      <Modal show={modalOpen} onHide={handleCloseModal} size='xl' centered>
{/*     <Modal dialogClassName="custom-modal" show={modalOpen} onHide={handleCloseModal} size='xl' centered> */}

      <Modal.Header closeButton>
        <Modal.Title>{buttonLabel}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={(e) => handleSubmit(e)}> {/* Passing newData to handleSubmit */}

       {compo === "User" && (
        <>
          <Row>
            <Col md={6}>
              <Form.Group controlId="formFirstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="first_name"
                  value={newData.first_name}
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
                  value={newData.last_name}
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
                  value={newData.email}
                  onChange={handleInputChange}
                  className="wider-field"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
          <Form.Group controlId="department">
            <Form.Label>Department</Form.Label>
            <Form.Control
              as="select" // Change input type to select
              name="department"
              value={newData.department}
              onChange={handleInputChange}
              className="wider-field"
              required
            >
              <option value="" disabled>
                Select Department
              </option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.department}
                </option>
              ))}
            </Form.Control>
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
                  value={newData.telephone_number}
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
                  value={newData.mobile_number}
                  onChange={handleInputChange}
                  className="wider-field"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
             <Col md={6}>
              <Form.Group controlId="superior">
                <Form.Label>Supervisor</Form.Label>
                <Form.Control
                  as="select"
                  name="supervisor"
                  value={newData.supervisor}
                  onChange={handleInputChange}
                  className="wider-field"
                  required
                >
                  <option value="" disabled>
                    Supervisor
                  </option>
                  {supervisors.map((sup) => (
                    <option key={sup.user__id} value={sup.user__id}>
                      {sup.user__first_name} {sup.user__last_name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={6}>
                <Form.Group controlId="role">
                   <Form.Label>Role Group</Form.Label>
                  <Select
                       name="area"
                      closeMenuOnSelect={false}
                      components={animatedComponents}
                      defaultValue={newData.role.map(role => role)}
                      isMulti
                      options={roles}
                     onChange={(selectedOptions) => {

                  setNewData({
                    ...newData,
                    role: selectedOptions.map(option => ({
                      label: option.label,
                      value: option.value,
                      id: option.id,
                    })),
                  });
                }}
              />

              </Form.Group>
            </Col>
          </Row>
          </>
             )}

      {compo === "Roles" && (
           <>
          {/* Roles-specific fields */}
          <Row>
            <Col md={6}>
              <Form.Group controlId="role">
                <Form.Label>Role Name</Form.Label>
                <Form.Control
                  type="text"
                  name="role"
                  value={newData.role}
                  onChange={handleInputChange}
                  className="wider-field"
                  required
                />
              </Form.Group>
            </Col>
          </Row>
        </>
      )}

          <Row>
            <Col md={12}>
                <Form.Group controlId="area">
                   <Form.Label>Area</Form.Label>
                  <Select
                       name="area"
                      closeMenuOnSelect={false}
                      components={animatedComponents}
                      defaultValue={newData.area}
                      isMulti
                      options={areas}
                       onChange={(selectedOptions) => {

                  setNewData({
                    ...newData,
                    area: selectedOptions.map(option => ({
                      label: option.label,
                      value: option.value,
                      id: option.id,
                    })),
                  });
                }}
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
             <tbody id="component_rows">
  {modules.map((permission, index) => (
    <tr key={index} id={permission.id}>
      <td>{permission.components}</td>
      <td>
        <Form.Check
          type="checkbox"
          checked={
            newData.permissions[permission.name]?.["view_" + permission.slug] || false
          }
          onChange={(e) =>
            handlePermissionChange(e, permission, "view_" + permission.slug)
          }
        />
      </td>
      <td>
        <Form.Check
          type="checkbox"
          checked={
            newData.permissions[permission.name]?.["add_" + permission.slug] || false
          }
          onChange={(e) =>
            handlePermissionChange(e, permission, "add_" + permission.slug)
          }
        />
      </td>
      <td>
        <Form.Check
          type="checkbox"
          checked={
            newData.permissions[permission.name]?.["edit_" + permission.slug] || false
          }
          onChange={(e) =>
            handlePermissionChange(e, permission, "edit_" + permission.slug)
          }
        />
      </td>
      <td>
        <Form.Check
          type="checkbox"
          checked={
            newData.permissions[permission.name]?.["delete_" + permission.slug] || false
          }
          onChange={(e) =>
            handlePermissionChange(e, permission, "delete_" + permission.slug)
          }
        />
      </td>
      <td>
        <Form.Check
          type="checkbox"
          checked={
            newData.permissions[permission.name]?.[
              "generate_report_" + permission.slug
            ] || false
          }
          onChange={(e) =>
            handlePermissionChange(e, permission, "generate_report_" + permission.slug)
          }
        />
      </td>
    </tr>
  ))}
</tbody>


              </Table>
            </Col>
          </Row>

          <Button variant="primary" type="submit" className="mt-3">
            {buttonLabel}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default FormModal;
