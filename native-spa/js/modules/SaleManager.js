import { ApiService } from '../services/ApiService.js';
import { showToast, formatDate, formatPrice, getStatusBadge } from '../utils/helpers.js';

export class SaleManager {
    constructor() {
        this.sales = [];
        this.clients = [];
        this.games = [];
        this.filteredSales = [];
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.id === 'addSaleBtn') {
                this.showAddSaleModal();
            }
            if (e.target.classList.contains('update-status-btn')) {
                this.updateStatus(e.target.dataset.id);
            }
            if (e.target.dataset.filter !== undefined) {
                this.filterSales(e.target.dataset.filter);
                // Update active button
                document.querySelectorAll('[data-filter]').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
            }
        });
    }

    async loadSales() {
        try {
            // Load all necessary data
            this.sales = await ApiService.getSales();
            this.clients = await ApiService.getClients();
            this.games = await ApiService.getGames();
            this.filteredSales = this.sales;
            this.renderSales();
        } catch (error) {
            showToast('Erreur lors du chargement des ventes', 'error');
        }
    }

    filterSales(filter) {
        if (filter === 'all') {
            this.filteredSales = this.sales;
        } else {
            this.filteredSales = this.sales.filter(sale => sale.statut === filter);
        }
        this.renderSales();
    }

    renderSales() {
        const container = document.getElementById('salesContainer');
        if (!container) return;

        container.innerHTML = `
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Client</th>
                        <th>Jeu</th>
                        <th>Quantité</th>
                        <th>Montant Total</th>
                        <th>Statut</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.filteredSales.map(sale => {
                        const client = this.clients.find(c => c.id == sale.client_id);
                        const game = this.games.find(g => g.id == sale.jeu_id);
                        
                        return `
                            <tr>
                                <td>${formatDate(sale.dateVente)}</td>
                                <td>${client ? client.nom : 'Client inconnu'}</td>
                                <td>${game ? game.titre : 'Jeu inconnu'}</td>
                                <td>${sale.quantite}</td>
                                <td>${formatPrice(sale.montantTotal)}</td>
                                <td>${getStatusBadge(sale.statut)}</td>
                                <td>
                                    <button class="btn btn-primary btn-sm update-status-btn" data-id="${sale.id}">
                                        Modifier Statut
                                    </button>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;
    }

    showAddSaleModal() {
        const modalContainer = document.getElementById('modalContainer');
        modalContainer.innerHTML = `
            <div class="modal fade" id="saleModal" tabindex="-1">
                <div class="modal-dialog">
                    <form id="saleForm" class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Nouvelle Vente</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label class="form-label">Client</label>
                                <select id="saleClient" class="form-control" required>
                                    <option value="">Sélectionner un client</option>
                                    ${this.clients.map(client => 
                                        `<option value="${client.id}">${client.nom} (${client.email})</option>`
                                    ).join('')}
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Jeu</label>
                                <select id="saleGame" class="form-control" required>
                                    <option value="">Sélectionner un jeu</option>
                                    ${this.games.filter(game => game.stockDisponible > 0).map(game => 
                                        `<option value="${game.id}" data-prix="${game.prix}">${game.titre} - ${formatPrice(game.prix)} (Stock: ${game.stockDisponible})</option>`
                                    ).join('')}
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Quantité</label>
                                <input type="number" id="saleQuantity" class="form-control" min="1" required>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-success" type="submit">Créer Vente</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        const modal = new bootstrap.Modal(document.getElementById('saleModal'));
        modal.show();

        // Form submission
        document.getElementById('saleForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                const clientId = document.getElementById('saleClient').value;
                const jeuId = document.getElementById('saleGame').value;
                const quantite = parseInt(document.getElementById('saleQuantity').value);

                await ApiService.addSale(clientId, jeuId, quantite);
                showToast('Vente créée avec succès!');
                modal.hide();
                this.loadSales();
            } catch (error) {
                showToast(error.message, 'error');
            }
        });
    }

    async updateStatus(id) {
        const sale = this.sales.find(s => s.id == id);
        if (!sale) return;

        // Create status update modal
        const modalContainer = document.getElementById('modalContainer');
        modalContainer.innerHTML = `
            <div class="modal fade" id="statusModal" tabindex="-1">
                <div class="modal-dialog">
                    <form id="statusForm" class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Modifier Statut de Vente</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label class="form-label">Statut actuel: <strong>${this.getStatusText(sale.statut)}</strong></label>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Nouveau Statut</label>
                                <select id="statusSelect" class="form-control" required>
                                    <option value="EN_ATTENTE" ${sale.statut === 'EN_ATTENTE' ? 'selected' : ''}>En Attente</option>
                                    <option value="CONFIRMEE" ${sale.statut === 'CONFIRMEE' ? 'selected' : ''}>Confirmée</option>
                                    <option value="LIVREE" ${sale.statut === 'LIVREE' ? 'selected' : ''}>Livrée</option>
                                    <option value="ANNULEE" ${sale.statut === 'ANNULEE' ? 'selected' : ''}>Annulée</option>
                                </select>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-primary" type="submit">Mettre à jour</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        const modal = new bootstrap.Modal(document.getElementById('statusModal'));
        modal.show();

        // Form submission
        document.getElementById('statusForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                const newStatus = document.getElementById('statusSelect').value;
                
                await ApiService.updateSaleStatus(id, newStatus);
                showToast('Statut mis à jour!');
                modal.hide();
                this.loadSales();
            } catch (error) {
                showToast(error.message, 'error');
            }
        });
    }

    getStatusText(statut) {
        const statusText = {
            'EN_ATTENTE': 'En Attente',
            'CONFIRMEE': 'Confirmée', 
            'LIVREE': 'Livrée',
            'ANNULEE': 'Annulée'
        };
        return statusText[statut] || statut;
    }
} 