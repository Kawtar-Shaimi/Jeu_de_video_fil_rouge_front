import { ApiService } from '../services/ApiService.js';
import { showToast } from '../utils/helpers.js';

export class ClientManager {
    constructor() {
        this.clients = [];
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Add client button
        document.addEventListener('click', (e) => {
            if (e.target.id === 'addClientBtn') {
                this.showAddClientModal();
            }
            if (e.target.classList.contains('edit-client-btn')) {
                this.editClient(e.target.dataset.id);
            }
            if (e.target.classList.contains('delete-client-btn')) {
                this.deleteClient(e.target.dataset.id);
            }
        });

        // Search clients
        document.addEventListener('input', (e) => {
            if (e.target.id === 'searchClients') {
                this.renderClients(e.target.value);
            }
        });
    }

    async loadClients() {
        try {
            this.clients = await ApiService.getClients();
            this.renderClients();
        } catch (error) {
            showToast('Erreur lors du chargement des clients', 'error');
        }
    }

    renderClients(searchFilter = '') {
        const container = document.getElementById('clientsContainer');
        if (!container) return;

        const filtered = this.clients.filter(client => 
            client.nom.toLowerCase().includes(searchFilter.toLowerCase()) ||
            client.email.toLowerCase().includes(searchFilter.toLowerCase())
        );

        container.innerHTML = `
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Email</th>
                        <th>Téléphone</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${filtered.map(client => `
                        <tr>
                            <td>${client.nom}</td>
                            <td>${client.email}</td>
                            <td>${client.phone}</td>
                            <td>
                                <button class="btn btn-warning btn-sm edit-client-btn" data-id="${client.id}">
                                    Modifier
                                </button>
                                <button class="btn btn-danger btn-sm delete-client-btn" data-id="${client.id}">
                                    Supprimer
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    showAddClientModal() {
        const modalContainer = document.getElementById('modalContainer');
        modalContainer.innerHTML = `
            <div class="modal fade" id="clientModal" tabindex="-1">
                <div class="modal-dialog">
                    <form id="clientForm" class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Nouveau Client</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label class="form-label">Nom</label>
                                <input type="text" id="clientNom" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Email</label>
                                <input type="email" id="clientEmail" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Téléphone</label>
                                <input type="tel" id="clientPhone" class="form-control" required>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-primary" type="submit">Ajouter</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        const modal = new bootstrap.Modal(document.getElementById('clientModal'));
        modal.show();

        // Form submission
        document.getElementById('clientForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                const nom = document.getElementById('clientNom').value.trim();
                const email = document.getElementById('clientEmail').value.trim();
                const phone = document.getElementById('clientPhone').value.trim();

                await ApiService.addClient(nom, email, phone);
                showToast('Client ajouté avec succès!');
                modal.hide();
                this.loadClients();
            } catch (error) {
                showToast(error.message, 'error');
            }
        });
    }

    async editClient(id) {
        const client = this.clients.find(c => c.id == id);
        if (!client) return;

        // Create edit client modal
        const modalContainer = document.getElementById('modalContainer');
        modalContainer.innerHTML = `
            <div class="modal fade" id="editClientModal" tabindex="-1">
                <div class="modal-dialog">
                    <form id="editClientForm" class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Modifier Client</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label class="form-label">Nom</label>
                                <input type="text" id="editClientNom" class="form-control" value="${client.nom}" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Email</label>
                                <input type="email" id="editClientEmail" class="form-control" value="${client.email}" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Téléphone</label>
                                <input type="tel" id="editClientPhone" class="form-control" value="${client.phone}" required>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-primary" type="submit">Sauvegarder</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        const modal = new bootstrap.Modal(document.getElementById('editClientModal'));
        modal.show();

        // Form submission
        document.getElementById('editClientForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                const nom = document.getElementById('editClientNom').value.trim();
                const email = document.getElementById('editClientEmail').value.trim();
                const phone = document.getElementById('editClientPhone').value.trim();

                await ApiService.updateClient(id, { nom, email, phone });
                showToast('Client modifié avec succès!');
                modal.hide();
                this.loadClients();
            } catch (error) {
                showToast(error.message, 'error');
            }
        });
    }

    async deleteClient(id) {
        const client = this.clients.find(c => c.id == id);
        if (client && confirm(`Supprimer le client "${client.nom}" ?`)) {
            try {
                await ApiService.deleteClient(id);
                showToast('Client supprimé avec succès!');
                this.loadClients();
            } catch (error) {
                showToast(error.message, 'error');
            }
        }
    }
} 