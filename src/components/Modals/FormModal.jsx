// AddEmployeeModal.jsx
import {React,useEffect, useState} from "react";
import { Modal, Button, Form, Row, Col, Table } from "react-bootstrap";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import {jwtDecode} from "jwt-decode";
import api from "../../api";
import { ACCESS_TOKEN } from "../../constants";


const animatedComponents = makeAnimated();



const FormModal = ({
  modalOpen,
  handleCloseModal,
  handleSubmit,
  newData,
  handleInputChange,
  setNewData,
  buttonLabel,
  compo,
}) => {
  const [modules, setModules] = useState([]);
  const [areas, setAreas] = useState([]);
  const [roles, setRoles] = useState([]);
  const [copyRoles, setCopyRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const token = localStorage.getItem(ACCESS_TOKEN);
  const [isCopyAreasChecked, setIsCopyAreasChecked] = useState(false);
const [isCopyPermissionsChecked, setIsCopyPermissionsChecked] = useState(false);



  const handlePermissionChange = (e, permission, action) => {
      let dfdf = getCheckedRows();
      console.log(dfdf)
      console.log("dfdf---")


      newData.modules = getCheckedRows()
    const updatedPermissions = { ...newData.permissions };

    if (!updatedPermissions[permission.name]) {
      updatedPermissions[permission.name] = {};
    }

    updatedPermissions[permission.name][action] = e.target.checked;

    setNewData((prevState) => ({
      ...prevState,
      permissions: updatedPermissions,
    }));
  };

  const handleChangeArea = (selectedOptions) => {
  console.log("Selected Options:", selectedOptions);

  // Ensure selectedOptions is always an array (if null, set empty array)
  const updatedAreas = selectedOptions ? selectedOptions.map(option => ({
    label: option.label,
    value: option.value,
    id: option.id,
  })) : [];

  setNewData((prevData) => ({
    ...prevData,
    area: updatedAreas, // Updates with selected areas (adding/removing)
  }));
};


  const getModules = () => {
    try {
      api.get(`/mrp/for-forms/`).then((response) => {
        const results = response.data;

        setModules(results.modules);

        const areaOptions = results.areas.map((area) => ({
          value: area.location,
          label: area.location,
          id: area.id,
        }));

        const roleOptions = results.roles.map((role) => ({
          value: role.role,
          label: role.role,
          id: role.id,
        }));

        setAreas(areaOptions);
        setRoles(results.roles);
        setCopyRoles(roleOptions)
        setDepartments(results.departments);
        setSupervisors(results.supervisors);
      });
    } catch (error) {
      console.error("Error decoding token", error);
    }
  };

  useEffect(() => {
    getModules();
  }, []);

  const handleRoleChange = (event) => {
    const selectedRole = event.target.selectedOptions[0].value;

    if (selectedRole) {
      api
        .get(`/mrp/roleplain/${selectedRole}/`)
        .then((response) => {
          const roleData = response.data;

          // Extract areas
          const areas = roleData.area.map((area) => ({
            label: area.location,
            value: area.location,
            id: area.id,
          }));

          // Extract permissions and map them by codename
          const permissionsMap = roleData.permissions.reduce((acc, perm) => {
            acc[perm.codename] = true;
            return acc;
          }, {});

          // Extract modules into a list of slugs
          const modules = roleData.modules.map((module) => module.slug);

          // Update newData with the fetched areas, permissions, and modules
          setNewData({
            ...newData,
            area: areas,
            permissions: permissionsMap,
            modules: modules,
            role: selectedRole,
          });
        })
    console.log(newData)
    console.log("newData---")
        .catch((error) => {
          console.error("Error fetching role details", error);
        });
    }
  };


const handleCopyAreasChange = (e) => {
  setNewData((prevState) => ({
    ...prevState,
    copy_area: e.target.checked, // Update copy_area field directly in newData
  }));
};

const handleCopyPermissionsChange = (e) => {
  setNewData((prevState) => ({
    ...prevState,
    copy_permissions: e.target.checked, // Update copy_permissions field directly in newData
  }));
};


  return (
    <Modal show={modalOpen} onHide={handleCloseModal} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>{buttonLabel}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={(e) => handleSubmit(e)}>
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
                      as="select"
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
                    <Form.Control
                      as="select"
                      name="role"
                      value={newData.role}
                      onChange={handleRoleChange}
                      className="wider-field"
                      required
                    >
                      <option value="" disabled>
                        Select Role Group
                      </option>
                      {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.role}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>
            </>
          )}
       {compo === "Roles" && (
        <>
          {/* Roles-specific fields */}
          <Row>
            <Col md={12}>
              <Form.Group controlId="role">
                <Form.Label>Role Name</Form.Label>
                <Form.Control
                  type="text"
                  name="role"
                  value={newData.role}
                  onChange={handleInputChange}
                  className="w-100"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

           {/* Checkbox to show or hide the select field */}
   <Row className="align-items-center mt-3 mb-3"> {/* Added mt-3 for top margin */}
  {/* Checkbox */}
  <Col md={3}>
    <Form.Group controlId="showGroupSelect" className="mb-0">
      <Form.Check
        type="checkbox"
        label="Copy areas to other groups"
        checked={newData.copy_area}
        onChange={handleCopyAreasChange}
      />
    </Form.Group>
  </Col>
  <Col md={3}>
    <Form.Group controlId="showGroupSelect" className="mb-0">
      <Form.Check
        type="checkbox"
        label="Copy permissions to other Groups"
        checked={newData.copy_permissions}
        onChange={handleCopyPermissionsChange}
      />
    </Form.Group>
  </Col>

 {/* Select Field (Hidden until Checkbox is Checked) */}
{/* Select Field (Hidden until Checkbox is Checked) */}
<Col
  md={6}
  style={{
    transition: "opacity 0.3s ease",
    visibility: (newData.copy_area || newData.copy_permissions) ? "visible" : "hidden",
    opacity: (newData.copy_area || newData.copy_permissions) ? 1 : 0,
  }}
>
  <Form.Group controlId="role">
    <Form.Label>Role Group</Form.Label>
    <Select
      name="roles"
      closeMenuOnSelect={false}
      components={animatedComponents}
      defaultValue=""
      isMulti
      options={copyRoles} // Roles options
      onChange={(selectedOptions) => {
        // Update roles state with both id and value
        setNewData((prevState) => ({
          ...prevState,
          roles: selectedOptions ? selectedOptions.map(option => ({
            id: option.id,  // Store the id
            value: option.value,  // Store the value
            label: option.label,  // Store the label
          })) : [], // In case no role is selected
        }));
      }}
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
                  value={newData.area}
                  isMulti
                  options={areas}
                  onChange={handleChangeArea}
                  className="w-100"
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
                  {modules.map((module, index) => {
                  return (
                    <tr key={index} id={module.id}>
                      <td>{module.parent_module? module.parent_module.module+" - ": ""} {module.module}</td>
                      {["view", "add", "edit", "delete", "generate_report"].map((action) => {
                        const permissionKey = `${action}_${module.slug}`; // Construct a unique key for each permission.
                        return (
                          <td key={action}>
                            <Form.Check
                              type="checkbox"
                              checked={newData.permissions[permissionKey] || false} // Ensure the correct key is checked.
                              onChange={(e) => {
                                const updatedPermissions = { ...newData.permissions };
                                updatedPermissions[permissionKey] = e.target.checked; // Update the permission dynamically.
                                setNewData((prevState) => ({
                                  ...prevState,
                                  permissions: updatedPermissions,
                                }));
                              }}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}

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

