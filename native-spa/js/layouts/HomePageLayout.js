
import EmployeeTableLayout from './EmployeeTableLayout.js';

const HomePageLayout = () => {

    return `      <h1 class="text-center">Employee Manager</h1>
    <!-- Add Employee Button -->
    <button
      class="btn btn-primary"
      data-bs-toggle="modal"
      data-bs-target="#employeeModal"
      id="addEmployeeBtn"
    >
      Add Employee
    </button>
    <!-- Toast Notification -->
    <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 1055">
      <div
        id="liveToast"
        class="toast"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div class="toast-header">
          <strong class="me-auto">Notification</strong>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="toast"
            aria-label="Close"
          ></button>
        </div>
        <div class="toast-body"></div>
      </div>
    </div>

    <!-- Search Input -->
    <div class="my-3">
      <input
        type="text"
        id="searchInput"
        class="form-control"
        placeholder="Search employee by name"
      />
    </div>
    ${EmployeeTableLayout()}
    `
}

export default HomePageLayout;