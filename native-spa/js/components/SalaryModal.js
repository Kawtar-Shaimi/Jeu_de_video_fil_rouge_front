const SalaryModal = ({ id, name, currentSalary, onSubmit }) => {
    const modalWrapper = document.createElement('div');
    modalWrapper.className = 'modal fade';
    modalWrapper.id = 'salaryModal';
    modalWrapper.tabIndex = -1;
    modalWrapper.setAttribute('aria-hidden', 'true');

    modalWrapper.innerHTML = `
      <div class="modal-dialog">
        <form id="salaryForm" class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Augment Salary</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <input type="hidden" name="salaryId" value="${id}" />
            <p><strong>Name:</strong> <span id="salaryName">${name}</span></p>
            <p><strong>Current Salary:</strong> <span id="currentSalary">${currentSalary}</span> MAD</p>
            <div class="mb-3">
              <label class="form-label">New Salary</label>
              <input type="number" id="augmentation" class="form-control" required />
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-success" type="submit">Update Salary</button>
          </div>
        </form>
      </div>
    `;

    modalWrapper.querySelector('#salaryForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const newSalary = parseFloat(modalWrapper.querySelector('#augmentation').value);
        if (isNaN(newSalary)) {
            showToast('Please enter a valid salary amount');
            return;
        }
        await onSubmit({ id, newSalary });
        const bsModal = bootstrap.Modal.getInstance(modalWrapper);
        bsModal.hide();
    });

    return modalWrapper;
};

export default SalaryModal;
