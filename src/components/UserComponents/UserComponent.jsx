// UserComponent.jsx
import React, { useEffect, useState, useRef } from "react";
import api from "../../api";
import { ACCESS_TOKEN } from '../../constants';
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/ActionableDataTable.css";
import "../../styles/UserComponent.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatDate } from '../../utility_function/formatDate';
import { ModuleProvider, useModuleContext } from "../ControlComponents/ModuleContext";
import { Button, Modal } from "react-bootstrap";
import UserTable from '../UserComponents/UserTable';
import FormModal from '../Modals/FormModal'; // Import the modal
import Header from '../HeaderComponents/Header'





const UserComponent = () => {

  const { modules, setModules, accessPermissions, setAccessPermissions } = useModuleContext();
  const permissions = accessPermissions;
  const token = localStorage.getItem(ACCESS_TOKEN);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadEdit, setLoadEdit] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState()
  const [newData, setNewData] = useState({
    employee_id: "",
    first_name: "",
    last_name: "",
    email: "",
    role: [],
    supervisor: "",
    mobile_number: "",
    telephone_number:"",
    department: "",
    area: [],
    modules: [],
    submodules: [],
    permissions: {}
  });

  const tableRef = useRef(null);


  const fetchData = async (page = 1, pageSize = 10, sortColumnIndex="user__first_name", sortDirection="asc", search="") => {

        try {
          const response = await api.get('/mrp/employees/', {

            params: { page, pageSize,  sortColumnIndex, sortDirection, search},
            });

        let data = response.data.data;

        let pagenumber = response.data.page_num_pages;
          const employees = data.map((employee) => ({
            first_name: employee.user.first_name,
            last_name: employee.user.last_name,
            email: employee.user.email,
            employee_number: employee.id,
            user_role: employee.role? employee.role.role: "-",
            supervisor: employee.superior ? `${employee.superior.user.first_name} ${employee.superior.user.last_name}`: "-",
            last_login: employee.user.last_login ? employee.user.last_login : "-",
            mobile_number: employee.cellphone_number,
            agency: "Agency A",
            status: employee.user.is_active ? "Active" : "Disabled",
          }));


          setData(employees);

          setPageCount(pagenumber);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }

    };

  useEffect(() => {
    fetchData();
  }, []);


const clearNewData = ()=> {
        setNewData({
    employee_id: '',
    first_name: '',
    last_name: '',
    email: '',
    supervisor: '',
    department: '',
    mobile_number: '',
    telephone_number: '',
    role: [],
    area: [],
    permissions: {},
    modules: [],
    submodules: [],
  });
     }

const handleOpenModal = async (id = null) => {

   clearNewData();
  if (id === null) {
    setModalOpen(true);  // Open the modal directly if id is null
    setLoadEdit(false);
    return;  // Exit the function early, no need to fetch data
  }

  try {
    setLoadEdit(true);
    const response = await api.get(`/mrp/employeesplain/${id}/`);


    const employee_data = response.data;

    const transformedAreas = employee_data.area.map((area) => ({
      label: area.location,
      value: area.location,
      id: area.id
    }));
const permissionsMap = employee_data.module_permissions.reduce((acc, perm) => {
            acc[perm.codename] = true;
            return acc;
          }, {});

    setNewData({
      ...employee_data,
      employee_id: employee_data.id,
      first_name: employee_data.user.first_name,
      last_name: employee_data.user.last_name,
      email: employee_data.user.email,
      supervisor: 3,
      department: employee_data.department.id,
      mobile_number: employee_data.cellphone_number,
      telephone_number: employee_data.telephone_number,

      role: employee_data.role? employee_data.role.id:0,
      area: transformedAreas,
      permissions: permissionsMap,

      modules: [
        ...employee_data.modules.map(module => module.module) || [],

      ]
    });
  } catch (error) {
    console.error('Error fetching user data:', error);  // Fixed the error logging
  }

  setModalOpen(true);
};



  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleInputChange = (e) => {
    setNewData({ ...newData, [e.target.name]: e.target.value });
  };

  const startCountdown = (seconds) => {
    setCountdown(seconds);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setSuccessModalOpen(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };


const getCheckedRows = () => {
      alert()
  const checkedComponents = [];
  const tbody = document.getElementById("component_rows");
  const rows = tbody.getElementsByTagName("tr");

  for (let row of rows) {
    const checkboxes = row.querySelectorAll("input[type='checkbox']");
    if (Array.from(checkboxes).some((checkbox) => checkbox.checked)) {
      const component = row.querySelector("td").innerText;
      checkedComponents.push(component);
    }
  }

  setNewData((prevState) => ({
    ...prevState,
    modules: Array.from(new Set([...prevState.modules, ...checkedComponents])),
  }));

  return checkedComponents;
};


  const handleSubmit = async (e) => {
  e.preventDefault();
    getCheckedRows()



  try {

    const response = await api.post('/mrp/employees/', newData);
    const message = response.data.message;

    setModalMessage(message);
      setCurrentPage(1)
      setModalOpen(false);
      setSuccessModalOpen(true);


      setTimeout(() => {
    console.log()
      }, 1000); // 10 seconds


  } catch (error) {
    console.error("Error adding employee:", error);
  }
};



const handleEditSubmit = async (e) => {
    e.preventDefault();
    console.log(newData)


    try {
      const response = await api.put(`/mrp/employee/edit/${newData.employee_id}/`, newData);

      const message = response.data.message;
      setModalMessage(message);
      setModalOpen(false);
      setSuccessModalOpen(true);
      clearNewData()
      setCurrentPage(1)


      setTimeout(() => {
            console.log()
      }, 1000);

    } catch (error) {
      console.error("Error updating employee:", error);
    }
}


  if (loading) {
    return <div className="text-center mt-4">Loading...</div>;
  }

  return (
      <>
      <Header/>
    <div className="container-fluid mt-4 px-4">

      {accessPermissions.some(permission =>
          permission.codename === 'view_user' ||
          permission.codename === 'add_user' ||
          permission.codename === 'delete_user' ||
          permission.codename === 'edit_user'
        ) && (
          <>

            <UserTable data={data} table={tableRef}  modalOpen={modalOpen} setModalOpen = {setModalOpen} handleOpenModal={handleOpenModal} fetchData={fetchData} pageCount={pageCount} currentPage={currentPage} setCurrentPage={setCurrentPage} accessPermissions={accessPermissions}/>
          </>
        )}




      {/* use AddEmployeeModal component here */}
      <FormModal
        modalOpen={modalOpen}
        handleCloseModal={handleCloseModal}
        handleSubmit={loadEdit?handleEditSubmit : handleSubmit}
        newData={newData}
        handleInputChange={handleInputChange}
        setNewData={setNewData}
        buttonLabel = {loadEdit? "Update Employee": "Add Employee"}
        compo = {'User'}

      />

      <Modal show={successModalOpen} onHide={() => setSuccessModalOpen(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{modalMessage}</p>
          <p>Closing in {countdown} seconds...</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setSuccessModalOpen(false)}>
            Close Now
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
    </>
  );
};

export default UserComponent;
