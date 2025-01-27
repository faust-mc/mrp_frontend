import { formatDate } from '../utility_function/formatDate';
import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import "../styles/UserComponent.css";
import { ACCESS_TOKEN } from '../constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faUndo,
  faToggleOn,
  faSync,
  faCopy,
  faEnvelope,
} from '@fortawesome/free-solid-svg-icons';
import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
import 'datatables.net-bs5';

function UserTable({ data, tableRef, modalOpen, setModalOpen,handleOpenModal, fetchData , pageCount, currentPage, setCurrentPage}) {

  const [searchTerm, setSearchTerm] = useState(''); // State to store search term
  const token = localStorage.getItem(ACCESS_TOKEN);
  const searchInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
   const [sortConfig, setSortConfig] = useState({ key: 'user__first_name', direction: 'asc' });
     // State to keep track of the current page

  useEffect(() => {
    // Destroy any existing DataTable instance
    if ($.fn.dataTable.isDataTable('#dataTable')) {
      $('#dataTable').DataTable().destroy();
    }

    // Initialize DataTable
    const dataTable = $('#dataTable').DataTable({
      data,
      columns: [
        { data: 'first_name' },
        { data: 'last_name' },
        { data: 'email' },
        { data: 'employee_number' },
        { data: 'user_role' },
        { data: 'supervisor', defaultContent: '-' },
        { data: 'email' },
        {
          data: 'last_login',
          render: (data) => (data ? formatDate(data) : 'N/A'),
        },
        { data: 'mobile_number' },
        { data: 'agency' },
        { data: 'status' },
        {
          data: null,
          orderable: false,
          createdCell: (td, cellData, rowData) => {

            const root = ReactDOM.createRoot(td); // Create a root for rendering
            root.render(
              <div className="d-flex justify-content-center">
                <FontAwesomeIcon
                  icon={faEdit}
                  className="action-icon"
                  title="Edit"
                  onClick={() => handleOpenModal(rowData.employee_number)}
                />
                <FontAwesomeIcon
                  icon={faUndo}
                  className="action-icon"
                  title="Return"
                />
                <FontAwesomeIcon
                  icon={faToggleOn}
                  className="action-icon"
                  title="Toggle"
                />
                <FontAwesomeIcon
                  icon={faSync}
                  className="action-icon"
                  title="Refresh"
                />
                <FontAwesomeIcon
                  icon={faCopy}
                  className="action-icon"
                  title="Copy"
                />
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="action-icon"
                  title="Email"
                />
              </div>
            );
          },
        },
      ],
      paging: false,
      searching: false,
      ordering: false,
      responsive: true,
      pageLength: 10,
      lengthChange: false,
      info: false,
    });


    // cleanup on unmount
    return () => {
      if ($.fn.dataTable.isDataTable('#dataTable')) {
        dataTable.destroy();
      }

    };
  }, [data, handleOpenModal, fetchData]); // Re-run effect on data or fetchData change




const handleSort = (key) => {
  let direction = 'asc';
  if (sortConfig.key === key && sortConfig.direction === 'asc') {
    direction = 'desc';
  }

  const updatedSortConfig = { key, direction };
  setSortConfig(updatedSortConfig);
  setLoading(true);

  fetchData(currentPage, pageSize, key, direction, searchTerm);
};


const handleNextPage = () => {
  if (currentPage < pageCount && !loading) {
    setLoading(true); // Temporarily disable the button
    const nextPage = currentPage + 1;

    fetchData(nextPage, pageSize, sortConfig.key, sortConfig.direction, searchTerm)
      .then(() => {
        setCurrentPage(nextPage); // Update the current page
      })
      .finally(() => {
        setTimeout(() => setLoading(false), 500); // Re-enable the button after 500ms
      });
  }
};

const handlePrevPage = () => {
  if (currentPage > 1 && !loading) {
    setLoading(true); // Temporarily disable the button
    const prevPage = currentPage - 1;

    fetchData(prevPage, pageSize, sortConfig.key, sortConfig.direction, searchTerm)
      .then(() => {
        setCurrentPage(prevPage); // Update the current page
      })
      .finally(() => {
        setTimeout(() => setLoading(false), 500); // Re-enable the button after 500ms
      });
  }
};



 const handleSearch = (e) => {
    const query = e.target.value;
    setSearchTerm(query);
    setCurrentPage(1)
    fetchData(1, pageSize, sortConfig.key, sortConfig.direction, query);
  };




  return (
    <div>
      {/* Custom Search and Dropdown on the same line */}
      <div className="mb-3 d-flex justify-content-between align-items-center">
        {/* Page Length Dropdown */}
        <div className="dataTables_length d-flex align-items-center">
  <label className="mb-0 me-2">Show</label>
  <select
    name="dataTable_length"
    className="form-select form-select-sm"
    aria-controls="dataTable"
    onChange={(e) => {
      const selectedPageSize = parseInt(e.target.value, 10); // Get the selected value and convert it to a number
      setPageSize(selectedPageSize); // Update pageSize state
      setCurrentPage(1); // Reset to the first page
      fetchData(1, selectedPageSize, sortConfig.key, sortConfig.direction, searchTerm); // Fetch data with the updated page size
    }}
  >
    <option value="10">10</option>
    <option value="25">25</option>
    <option value="50">50</option>
    <option value="100">100</option>
  </select>
</div>


        {/* Search Bar */}
        <div className="d-flex justify-content-end">
      <input
        ref={searchInputRef}
        type="text"
        className="form-control w-100"
        placeholder="Search..."
        value={searchTerm} // Bind input to the state
        onChange={handleSearch} // Trigger the search function on change
      />
      </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table ref={tableRef} id="dataTable" className="table table-striped table-hover">
          <thead className="thead-dark">
            <tr>
              <th
                scope="col"
                onClick={() => handleSort("user__first_name")}
                style={{ cursor: 'pointer' }}
              >
                First Name
              </th>
              <th
               scope="col"
                onClick={() => handleSort("user__last_name")}
                style={{ cursor: 'pointer' }}>
                  Last Name
               </th>
              <th
              scope="col"
                onClick={() => handleSort("user__email")}
                style={{ cursor: 'pointer' }}
                >
                  Email
               </th>
              <th
              scope="col"
                onClick={() => handleSort('user__employee__id')}
                style={{ cursor: 'pointer' }}
                >
                  Emp. No
               </th>
              <th
              scope="col"
                onClick={() => handleSort('user__employee__role__role')}
                style={{ cursor: 'pointer' }}
              >
                  User Role
               </th>
              <th
                scope="col"
                onClick={() => handleSort('user__employee__superior__user__last_name')}
                style={{ cursor: 'pointer' }}
              >
                  Imm. Sup.
               </th>
              <th
                scope="col"
                onClick={() => handleSort('user__email')}
                style={{ cursor: 'pointer' }}
              >
                  Email Notif
              </th>
              <th
                scope="col"
                onClick={() => handleSort('user__last_login')}
                style={{ cursor: 'pointer' }}
              >
                  Last Login
               </th>
              <th
                scope="col"
                onClick={() => handleSort('user__employee__cellphone_number')}
                style={{ cursor: 'pointer' }}
              >
                  Mobile Number
               </th>
              <th
                scope="col"
                onClick={() => handleSort('user__status')}
                style={{ cursor: 'pointer' }}
              >
                  Agency
               </th>
              <th
                scope="col"
                onClick={() => handleSort('user__first_name')}
                style={{ cursor: 'pointer' }}
              >
                  Status
               </th>
              <th>
                  Action
               </th>
            </tr>
          </thead>
        </table>
        <div className="pagination-controls">
                <button
                    className="btn btn-secondary"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1} // Disable if on the first page
                >
                    Previous
                </button>
                <span> Page {currentPage} of {pageCount}</span>
                <button
                    className="btn btn-secondary"
                    onClick={handleNextPage}
                    disabled={currentPage===pageCount } // Disable if there are no more tickets
                >
                    Next
                </button>
            </div>
      </div>

    </div>
  );
}

export default UserTable;
