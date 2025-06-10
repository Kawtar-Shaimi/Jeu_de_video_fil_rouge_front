import { getJeux, deleteJeu } from '../api/jeuService.js';
import { showToast } from './Toast.js';

let jeux = [];

export const renderJeuxTable = async (searchTerm = '', genreFilter = '', typeFilter = '') => {
    try {
        jeux = await getJeux();
        
        // Filtrer les jeux selon les critères
        const filteredJeux = jeux.filter(jeu => {
            const matchesSearch = jeu.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                jeu.editeur.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                jeu.genre.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesGenre = !genreFilter || jeu.genre === genreFilter;
            const matchesType = !typeFilter || jeu.type === typeFilter;
            
            return matchesSearch && matchesGenre && matchesType;
        });

        const tableContainer = document.getElementById('jeuxTable');
        tableContainer.innerHTML = `
            <div class="table-responsive">
                <table class="table table-striped table-hover">
                    <thead class="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Titre</th>
                            <th>Prix</th>
                            <th>Genre</th>
                            <th>Éditeur</th>
                            <th>Stock</th>
                            <th>Type</th>
                            <th>Spécificités</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredJeux.map(jeu => `
                            <tr>
                                <td>${jeu.id}</td>
                                <td>${jeu.titre}</td>
                                <td>${jeu.prix}€</td>
                                <td><span class="badge bg-secondary">${jeu.genre}</span></td>
                                <td>${jeu.editeur}</td>
                                <td>
                                    <span class="badge ${jeu.stockDisponible > 0 ? 'bg-success' : 'bg-danger'}">
                                        ${jeu.stockDisponible}
                                    </span>
                                </td>
                                <td><span class="badge ${jeu.type === 'PC' ? 'bg-primary' : 'bg-info'}">${jeu.type}</span></td>
                                <td class="small">
                                    ${jeu.type === 'PC' ? 
                                        `Config: ${jeu.configurationMinimale ? jeu.configurationMinimale.substring(0, 30) + '...' : 'N/A'}<br>
                                         DVD: ${jeu.supportDVD ? 'Oui' : 'Non'}` :
                                        `Plateforme: ${jeu.plateforme}<br>Région: ${jeu.regionCode}`
                                    }
                                </td>
                                <td>
                                    <button class="btn btn-sm btn-outline-primary me-1" onclick="editJeu(${jeu.id})">
                                        <i class="bi bi-pencil"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger" onclick="deleteJeuAction(${jeu.id})">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        // Afficher un message si aucun jeu n'est trouvé
        if (filteredJeux.length === 0) {
            tableContainer.innerHTML = `
                <div class="alert alert-info text-center">
                    <i class="bi bi-info-circle"></i> Aucun jeu trouvé avec ces critères.
                </div>
            `;
        }

    } catch (error) {
        console.error('Erreur lors du chargement des jeux:', error);
        document.getElementById('jeuxTable').innerHTML = `
            <div class="alert alert-danger text-center">
                <i class="bi bi-exclamation-triangle"></i> Erreur lors du chargement des jeux.
            </div>
        `;
    }
};

// Fonctions globales pour les boutons
window.editJeu = (id) => {
    console.log('Éditer jeu:', id);
    showToast('Fonctionnalité d\'édition à implémenter');
};

window.deleteJeuAction = async (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce jeu ?')) {
        try {
            const success = await deleteJeu(id);
            if (success) {
                showToast('Jeu supprimé avec succès', 'success');
                renderJeuxTable();
            } else {
                showToast('Erreur lors de la suppression', 'danger');
            }
        } catch (error) {
            console.error('Erreur:', error);
            showToast('Erreur lors de la suppression', 'danger');
        }
    }
}; 