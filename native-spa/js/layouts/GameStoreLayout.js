export default function GameStoreLayout() {
    return `
        <div class="container-fluid py-4">
            <h1 class="text-center mb-4">🎮 Magasin de Jeux Vidéo</h1>
            
            <!-- Toast notification -->
            <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 1055">
                <div id="toast" class="toast" role="alert">
                    <div class="toast-header">
                        <strong class="me-auto">Notification</strong>
                        <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
                    </div>
                    <div class="toast-body"></div>
                </div>
            </div>

            <!-- Navigation tabs -->
            <ul class="nav nav-tabs" id="mainTabs" role="tablist">
                <li class="nav-item" role="presentation">
                    <button class="nav-link active" id="clients-tab" data-bs-toggle="tab" data-bs-target="#clients" type="button">
                        👥 Clients
                    </button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="games-tab" data-bs-toggle="tab" data-bs-target="#games" type="button">
                        🎮 Jeux
                    </button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="sales-tab" data-bs-toggle="tab" data-bs-target="#sales" type="button">
                        💰 Ventes
                    </button>
                </li>
            </ul>

            <!-- Tab content -->
            <div class="tab-content mt-3" id="mainTabContent">
                
                <!-- Clients tab -->
                <div class="tab-pane fade show active" id="clients" role="tabpanel">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <button class="btn btn-primary" id="addClientBtn">
                            Ajouter Client
                        </button>
                        <input type="text" id="searchClients" class="form-control w-50" placeholder="Rechercher un client...">
                    </div>
                    <div id="clientsContainer"></div>
                </div>

                <!-- Games tab -->
                <div class="tab-pane fade" id="games" role="tabpanel">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h4>Catalogue des Jeux</h4>
                        <input type="text" id="searchGames" class="form-control w-50" placeholder="Rechercher un jeu...">
                    </div>
                    <div id="gamesContainer"></div>
                </div>

                <!-- Sales tab -->
                <div class="tab-pane fade" id="sales" role="tabpanel">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <button class="btn btn-success" id="addSaleBtn">
                            Nouvelle Vente
                        </button>
                        <div class="btn-group" id="statusFilters">
                            <button class="btn btn-outline-secondary active" data-filter="all">Toutes</button>
                            <button class="btn btn-outline-warning" data-filter="EN_ATTENTE">En Attente</button>
                            <button class="btn btn-outline-info" data-filter="CONFIRMEE">Confirmées</button>
                            <button class="btn btn-outline-success" data-filter="LIVREE">Livrées</button>
                            <button class="btn btn-outline-danger" data-filter="ANNULEE">Annulées</button>
                        </div>
                    </div>
                    <div id="salesContainer"></div>
                </div>
            </div>

            <!-- Modal containers -->
            <div id="modalContainer"></div>
        </div>
    `;
} 