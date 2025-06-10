import { ApiService } from '../services/ApiService.js';
import { showToast, formatPrice, getGameTypeBadge } from '../utils/helpers.js';

export class GameManager {
    constructor() {
        this.games = [];
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('edit-stock-btn')) {
                this.editStock(e.target.dataset.id);
            }
        });

        document.addEventListener('input', (e) => {
            if (e.target.id === 'searchGames') {
                this.renderGames(e.target.value);
            }
        });
    }

    async loadGames() {
        try {
            this.games = await ApiService.getGames();
            this.renderGames();
        } catch (error) {
            showToast('Erreur lors du chargement des jeux', 'error');
        }
    }

    renderGames(searchFilter = '') {
        const container = document.getElementById('gamesContainer');
        if (!container) return;

        const filtered = this.games.filter(game => 
            game.titre.toLowerCase().includes(searchFilter.toLowerCase()) ||
            game.genre.toLowerCase().includes(searchFilter.toLowerCase())
        );

        container.innerHTML = `
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>Titre</th>
                        <th>Type</th>
                        <th>Prix</th>
                        <th>Genre</th>
                        <th>Stock</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${filtered.map(game => {
                        const type = game.configurationMinimale ? 'PC' : 'Console';
                        return `
                            <tr>
                                <td>
                                    <strong>${game.titre}</strong><br/>
                                    <small class="text-muted">${game.editeur}</small>
                                </td>
                                <td>${getGameTypeBadge(type)}</td>
                                <td>${formatPrice(game.prix)}</td>
                                <td>${game.genre}</td>
                                <td>
                                    <span class="badge ${game.stockDisponible > 0 ? 'bg-success' : 'bg-danger'}">
                                        ${game.stockDisponible}
                                    </span>
                                </td>
                                <td>
                                    <button class="btn btn-warning btn-sm edit-stock-btn" data-id="${game.id}">
                                        Modifier Stock
                                    </button>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;
    }

    async editStock(id) {
        const game = this.games.find(g => g.id == id);
        if (!game) return;

        // Create stock edit modal
        const modalContainer = document.getElementById('modalContainer');
        modalContainer.innerHTML = `
            <div class="modal fade" id="stockModal" tabindex="-1">
                <div class="modal-dialog">
                    <form id="stockForm" class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Modifier Stock - ${game.titre}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label class="form-label">Stock actuel: <strong>${game.stockDisponible}</strong></label>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Nouveau Stock</label>
                                <input type="number" id="newStock" class="form-control" min="0" value="${game.stockDisponible}" required>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-primary" type="submit">Mettre à jour</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        const modal = new bootstrap.Modal(document.getElementById('stockModal'));
        modal.show();

        // Form submission
        document.getElementById('stockForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                const newStock = parseInt(document.getElementById('newStock').value);
                
                await ApiService.updateGame(id, { stockDisponible: newStock });
                showToast('Stock mis à jour!');
                modal.hide();
                this.loadGames();
            } catch (error) {
                showToast(error.message, 'error');
            }
        });
    }
} 