import { getEmployees, deleteEmployee, getFile } from '../api/employeeService.js';
import { showToast } from './Toast.js';
import { showAugmentModal, showEditModal, showEmployeeModal } from './hooks/showModals.js';

export const renderEmployeeTable = async (filter = '') => {
    const tbody = document.getElementById('employeeTable');
    tbody.innerHTML = '';

    const employees = await getEmployees();
    const filtered = employees.filter(emp =>
        emp.name?.toLowerCase().includes(filter.toLowerCase())
    );

    filtered.forEach(emp => {
        const tr = document.createElement('tr');

        // Photo
        const photoTd = document.createElement('td');
        const img = document.createElement('img');
        img.src = getFile(emp.photo);
        img.className = 'img-thumbnail';
        photoTd.appendChild(img);

        // Name
        const nameTd = document.createElement('td');
        nameTd.textContent = emp.name;

        // Actions
        const actionTd = document.createElement('td');

        const showBtn = document.createElement('button');
        showBtn.className = 'btn btn-info btn-sm me-1';
        showBtn.textContent = 'Show';
        showBtn.addEventListener('click', () => showEmployeeModal(emp));

        const augmentBtn = document.createElement('button');
        augmentBtn.className = 'btn btn-success btn-sm me-1';
        augmentBtn.textContent = 'Augment';
        augmentBtn.addEventListener('click', () => showAugmentModal(emp));

        const editBtn = document.createElement('button');
        editBtn.className = 'btn btn-warning btn-sm me-1';
        editBtn.textContent = 'Edit';
        editBtn.addEventListener('click', () => showEditModal(emp));

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-danger btn-sm';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', async () => {
            if (confirm(`Delete ${emp.name}?`)) {
                await deleteEmployee(emp.id);
                showToast('Employee deleted');
                renderEmployeeTable();
            }
        });

        actionTd.append(showBtn, augmentBtn, editBtn, deleteBtn);
        tr.append(photoTd, nameTd, actionTd);
        tbody.appendChild(tr);
    });
};

