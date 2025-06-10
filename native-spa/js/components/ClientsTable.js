import { getClients, deleteClient } from '../api/clientService.js';
import { showToast } from './Toast.js';

let clients = [];

export const renderClientsTable = async (searchTerm = '') => {
    try {
        clients = await getClients();
        
        // Filtrer les clients selon le terme de recherche
        const filteredClients = clients.filter(client => 
            client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.phone.includes(searchTerm)
        );

        const tableContainer = document.getElementById('clientsTable');
        tableContainer.innerHTML = `
            <div class="table-responsive">
                <table class="table table-striped table-hover">
                    <thead class="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Nom</th>
                            <th>Email</th>
                            <th>Téléphone</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredClients.map(client => `
                            <tr>
                                <td>${client.id}</td>
                                <td>${client.nom}</td>
                                <td>${client.email}</td>
                                <td>${client.phone}</td>
                                <td>
                                    <button class="btn btn-sm btn-outline-primary me-1" onclick="editClient(${client.id})">
                                        <i class="bi bi-pencil"></i> Modifier
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger" onclick="deleteClientAction(${client.id})">
                                        <i class="bi bi-trash"></i> Supprimer
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        // Afficher un message si aucun client n'est trouvé
        if (filteredClients.length === 0) {
            tableContainer.innerHTML = `
                <div class="alert alert-info text-center">
                    <i class="bi bi-info-circle"></i> Aucun client trouvé.
                </div>
            `;
        }

    } catch (error) {
        console.error('Erreur lors du chargement des clients:', error);
        document.getElementById('clientsTable').innerHTML = `
            <div class="alert alert-danger text-center">
                <i class="bi bi-exclamation-triangle"></i> Erreur lors du chargement des clients.
            </div>
        `;
    }
};

// Fonctions globales pour les boutons
window.editClient = (id) => {
    // TODO: Implémenter l'édition
    console.log('Éditer client:', id);
    showToast('Fonctionnalité d\'édition à implémenter');
};

window.deleteClientAction = async (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
        try {
            const success = await deleteClient(id);
            if (success) {
                showToast('Client supprimé avec succès', 'success');
                renderClientsTable();
            } else {
                showToast('Erreur lors de la suppression', 'danger');
            }
        } catch (error) {
            console.error('Erreur:', error);
            showToast('Erreur lors de la suppression', 'danger');
        }
    }
}; 