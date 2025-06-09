const EditModal = ({ name = '', email = '', onEdit }) => {
  const modal = document.createElement('div');
  modal.className = 'modal fade';
  modal.id = 'editModal';
  modal.tabIndex = -1;
  modal.setAttribute('aria-hidden', 'true');

  modal.innerHTML = `
      <div class="modal-dialog">
        <form id="editForm" class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Edit Employee</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <input type="hidden" id="editId" />
            <div class="mb-3">
              <label class="form-label">Name</label>
              <input type="text" id="editName" class="form-control" value="${name}" />
            </div>
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input type="email" id="editEmail" class="form-control" value="${email}" />
            </div>
            <div class="mb-3">
              <label class="form-label">Password</label>
              <input type="password" id="editPassword" class="form-control" />
              <span class="text-muted">Leave empty to keep current password</span>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" type="submit">Save Changes</button>
          </div>
        </form>
      </div>
    `;

  modal.querySelector('#editForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const updatedData = {
      name: modal.querySelector('#editName').value,
      email: modal.querySelector('#editEmail').value,
      password: modal.querySelector('#editPassword').value || undefined,
    };
    onEdit(updatedData);
    const bsModal = bootstrap.Modal.getInstance(modal);
    bsModal.hide();
  });

  return modal;
};

export default EditModal;