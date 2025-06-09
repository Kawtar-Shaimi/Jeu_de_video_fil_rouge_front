import { renderEmployeeTable } from './components/EmployeeTable.js';
import { showEmployeeFormModal } from './components/hooks/showModals.js';
import HomePageLayout from './layouts/HomePageLayout.js'

document.addEventListener('DOMContentLoaded', () => {
    init();
    renderEmployeeTable();
    document.getElementById('addEmployeeBtn').addEventListener('click', () => {
        showEmployeeFormModal();
    });
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', () => {
        renderEmployeeTable(searchInput.value);
    });
});


const init = () => {
    const root = document.getElementById('root');
    root.innerHTML = HomePageLayout();
}