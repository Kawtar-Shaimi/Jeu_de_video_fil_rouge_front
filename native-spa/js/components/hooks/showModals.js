import EditModal from '../EditModal.js';
import SalaryModal from '../SalaryModal.js';
import ShowModal from '../ShowModal.js';
import EmployeeForm from '../EmployeeForm.js';
import { showToast } from '../Toast.js'
import { getFile, addEmployee, editEmployee, augmentSalary } from '../../api/employeeService.js';
import { renderEmployeeTable } from '../EmployeeTable.js';
export const showEditModal = (employee) => {
    const existing = document.getElementById('editModal');
    if (existing) existing.remove();

    const modal = EditModal({
        name: employee.name,
        email: employee.email,
        onEdit: async (updatedData) => {
            const success = await editEmployee(employee.id, updatedData);
            if (success) {
                showToast('Employee updated!');
                renderEmployeeTable();
            } else {
                showToast('Update failed.');
            }
        }
    });

    document.body.appendChild(modal);
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
};

export const showAugmentModal = (employee) => {
    const existing = document.getElementById('salaryModal');
    if (existing) existing.remove();

    const modal = SalaryModal({
        id: employee.id,
        name: employee.name,
        currentSalary: employee.salary,
        onSubmit: async ({ id, newSalary }) => {
            const success = await augmentSalary(id, newSalary);
            if (success) {
                showToast('Salary updated');
                renderEmployeeTable();
            } else {
                showToast('Salary update failed');
            }

        }
    });

    document.body.appendChild(modal);
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
};


export const showEmployeeModal = (employee) => {
    const existing = document.getElementById('employeeShowModal');
    if (existing) existing.remove();

    const modal = ShowModal({
        id: employee.id,
        name: employee.name,
        email: employee.email,
        salary: employee.salary,
        photo: getFile(employee.photo)
    });

    document.body.appendChild(modal);
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
};

export const showEmployeeFormModal = () => {
    const existing = document.getElementById('employeeModal');
    if (existing) existing.remove();

    const modal = EmployeeForm({
        onSubmit: async (data) => {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('email', data.email);
            formData.append('password', data.password);
            formData.append('salary', data.salary);
            formData.append('photo', data.photo);
            const success = await addEmployee(formData);
            if (success) {
                showToast('Employee added successfully!');
                renderEmployeeTable();
            } else {
                showToast('Failed to add employee.');
            }
        }
    });

    document.body.appendChild(modal);
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
};

