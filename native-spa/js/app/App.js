import GameStoreLayout from '../layouts/GameStoreLayout.js';
import { ClientManager } from '../modules/ClientManager.js';
import { GameManager } from '../modules/GameManager.js';
import { SaleManager } from '../modules/SaleManager.js';

export function initApp() {
    const root = document.getElementById('root');
    root.innerHTML = GameStoreLayout();
    
    // Initialize managers
    const clientManager = new ClientManager();
    const gameManager = new GameManager();
    const saleManager = new SaleManager();
    
    // Setup tab switching
    setupTabNavigation();
    
    // Load initial data
    loadAllData();
}

function setupTabNavigation() {
    document.addEventListener('shown.bs.tab', function (event) {
        const targetTab = event.target.getAttribute('data-bs-target');
        
        if (targetTab === '#clients') {
            window.clientManager?.loadClients();
        } else if (targetTab === '#games') {
            window.gameManager?.loadGames();
        } else if (targetTab === '#sales') {
            window.saleManager?.loadSales();
        }
    });
}

async function loadAllData() {
    // Store managers globally for tab access
    window.clientManager = new ClientManager();
    window.gameManager = new GameManager();
    window.saleManager = new SaleManager();
    
    // Load initial data for active tab (clients)
    await window.clientManager.loadClients();
} 