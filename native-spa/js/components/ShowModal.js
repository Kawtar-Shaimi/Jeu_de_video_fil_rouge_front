const ShowModal = ({ id, name, email, salary, photo }) => {
    const modalWrapper = document.createElement('div');
    modalWrapper.className = 'modal fade';
    modalWrapper.id = 'employeeShowModal';
    modalWrapper.tabIndex = -1;
    modalWrapper.setAttribute('aria-hidden', 'true');

    modalWrapper.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${name}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body text-center">
            <div id="employeePhoto" class="mb-3">
              <img src="${photo}" class="img-thumbnail" alt="${name}" />
            </div>
            <p><strong>Id:</strong> ${id}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Current Salary:</strong> ${salary} MAD</p>
          </div>
        </div>
      </div>
    `;

    return modalWrapper;
};

export default ShowModal;
