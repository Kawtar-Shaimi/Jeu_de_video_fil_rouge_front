import { getVentes, deleteVente } from '../api/venteService.js';
import { getClients } from '../api/clientService.js';
import { getJeux } from '../api/jeuService.js';
import { showToast } from './Toast.js';

let ventes = [];
let clients = [];
let jeux = [];

export const renderVentesTable = async (searchTerm = '', statutFilter = '') => {
    try {
        // Charger les données nécessaires
        [ventes, clients, jeux] = await Promise.all([
            getVentes(),
            getClients(),
            getJeux()
        ]);
        
        // Créer des maps pour les lookups rapides
        const clientsMap = new Map(clients.map(c => [c.id, c]));
        const jeuxMap = new Map(jeux.map(j => [j.id, j]));
        
        // Filtrer les ventes selon les critères
        const filteredVentes = ventes.filter(vente => {
            const client = clientsMap.get(vente.clientId);
            const jeu = jeuxMap.get(vente.jeuId);
            
            const matchesSearch = !searchTerm || 
                (client && client.nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (jeu && jeu.titre.toLowerCase().includes(searchTerm.toLowerCase())) ||
                vente.id.toString().includes(searchTerm);
            
            const matchesStatut = !statutFilter || vente.statut === statutFilter;
            
            return matchesSearch && matchesStatut;
        });

        const tableContainer = document.getElementById('ventesTable');
        tableContainer.innerHTML = `
            <div class="table-responsive">
                <table class="table table-striped table-hover">
                    <thead class="table-dark">
                        <tr>
                            <th>ID</th>
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
                        ${filteredVentes.map(vente => {
                            const client = clientsMap.get(vente.clientId);
                            const jeu = jeuxMap.get(vente.jeuId);
                            const date = new Date(vente.dateVente).toLocaleDateString('fr-FR');
                            
                            return `
                                <tr>
                                    <td>${vente.id}</td>
                                    <td>${date}</td>
                                    <td>${client ? client.nom : 'Client inconnu'}</td>
                                    <td>${jeu ? jeu.titre : 'Jeu inconnu'}</td>
                                    <td>${vente.quantite}</td>
                                    <td>${vente.montantTotal}€</td>
                                    <td>
                                        <span class="badge ${getStatusBadgeClass(vente.statut)}">
                                            ${vente.statut}
                                        </span>
                                    </td>
                                    <td>
                                        <button class="btn btn-sm btn-outline-primary me-1" onclick="editVente(${vente.id})">
                                            <i class="bi bi-pencil"></i>
                                        </button>
                                        <button class="btn btn-sm btn-outline-danger" onclick="deleteVenteAction(${vente.id})">
                                            <i class="bi bi-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;

        // Afficher un message si aucune vente n'est trouvée
        if (filteredVentes.length === 0) {
            tableContainer.innerHTML = `
                <div class="alert alert-info text-center">
                    <i class="bi bi-info-circle"></i> Aucune vente trouvée avec ces critères.
                </div>
            `;
        }

    } catch (error) {
        console.error('Erreur lors du chargement des ventes:', error);
        document.getElementById('ventesTable').innerHTML = `
            <div class="alert alert-danger text-center">
                <i class="bi bi-exclamation-triangle"></i> Erreur lors du chargement des ventes.
            </div>
        `;
    }
};

const getStatusBadgeClass = (statut) => {
    switch (statut) {
        case 'PAYÉE': return 'bg-success';
        case 'EN_ATTENTE': return 'bg-warning';
        case 'ANNULÉE': return 'bg-danger';
        default: return 'bg-secondary';
    }
};

// Fonctions globales pour les boutons
window.editVente = (id) => {
    console.log('Éditer vente:', id);
    showToast('Fonctionnalité d\'édition à implémenter');
};

window.deleteVenteAction = async (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette vente ?')) {
        try {
            const success = await deleteVente(id);
            if (success) {
                showToast('Vente supprimée avec succès', 'success');
                renderVentesTable();
            } else {
                showToast('Erreur lors de la suppression', 'danger');
            }
        } catch (error) {
            console.error('Erreur:', error);
            showToast('Erreur lors de la suppression', 'danger');
        }
    }
}; 