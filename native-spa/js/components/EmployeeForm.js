const EmployeeForm = ({ onSubmit }) => {
    const modalWrapper = document.createElement('div');
    modalWrapper.className = 'modal fade';
    modalWrapper.id = 'employeeModal';
    modalWrapper.tabIndex = -1;
    modalWrapper.setAttribute('aria-labelledby', 'employeeModalLabel');
    modalWrapper.setAttribute('aria-hidden', 'true');

    modalWrapper.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-content">
          <form id="employeeForm">
            <div class="modal-header">
              <h5 class="modal-title" id="employeeModalLabel">Add New Employee</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <div id="formErrors" class="alert alert-danger d-none"></div>
  
              <div class="mb-3">
                <label for="empName" class="form-label">Name</label>
                <input type="text" class="form-control" id="empName" />
              </div>
  
              <div class="mb-3">
                <label for="empEmail" class="form-label">Email</label>
                <input type="email" class="form-control" id="empEmail" />
              </div>
  
              <div class="mb-3">
                <label for="empPassword" class="form-label">Password</label>
                <input type="password" class="form-control" id="empPassword" />
              </div>
  
              <div class="mb-3">
                <label for="empSalary" class="form-label">Salary</label>
                <input type="number" class="form-control" id="empSalary" />
              </div>
  
              <div class="mb-3">
                <label for="empPhoto" class="form-label">Photo</label>
                <input type="file" class="form-control" id="empPhoto" accept="image/*" />
                <img id="photoPreview" class="img-thumbnail mt-2 d-none" alt="Preview" />
              </div>
            </div>
            <div class="modal-footer">
              <button type="submit" class="btn btn-primary">Add Employee</button>
            </div>
          </form>
        </div>
      </div>
    `;

    setTimeout(() => {
        const photoInput = modalWrapper.querySelector('#empPhoto');
        const previewImg = modalWrapper.querySelector('#photoPreview');
        if (photoInput) {
            photoInput.addEventListener('change', () => {
                const file = photoInput.files[0];
                if (file) {
                    previewImg.src = URL.createObjectURL(file);
                    previewImg.classList.remove('d-none');
                }
            });
        }

        modalWrapper.querySelector('#employeeForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = {
                name: modalWrapper.querySelector('#empName').value,
                email: modalWrapper.querySelector('#empEmail').value,
                password: modalWrapper.querySelector('#empPassword').value,
                salary: parseFloat(modalWrapper.querySelector('#empSalary').value),
                photo: modalWrapper.querySelector('#empPhoto').files[0]
            };
            await onSubmit?.(data);
        });
    });

    return modalWrapper;
};

export default EmployeeForm;
