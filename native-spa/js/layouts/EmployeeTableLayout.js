

const EmployeeTableLayout = () => {
    return `<table class="table table-bordered employee-list">
    <thead>
      <tr>
        <th>Photo</th>
        <th>Name</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody id="employeeTable"></tbody>
  </table>`;
}

export default EmployeeTableLayout;