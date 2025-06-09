export function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastBody = toast.querySelector('.toast-body');
    
    toastBody.textContent = message;
    
    // Remove existing classes
    toast.classList.remove('text-bg-success', 'text-bg-danger', 'text-bg-warning', 'text-bg-info');
    
    // Add appropriate class based on type
    switch(type) {
        case 'error':
            toast.classList.add('text-bg-danger');
            break;
        case 'warning':
            toast.classList.add('text-bg-warning');
            break;
        case 'info':
            toast.classList.add('text-bg-info');
            break;
        default:
            toast.classList.add('text-bg-success');
    }
    
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
}

export function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR') + ' ' + date.toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'});
}

export function formatPrice(price) {
    return parseFloat(price).toFixed(2) + ' €';
}

export function getStatusBadge(statut) {
    const badges = {
        'EN_ATTENTE': 'bg-warning',
        'CONFIRMEE': 'bg-info',
        'LIVREE': 'bg-success',
        'ANNULEE': 'bg-danger'
    };
    
    const statusText = {
        'EN_ATTENTE': 'En Attente',
        'CONFIRMEE': 'Confirmée',
        'LIVREE': 'Livrée',
        'ANNULEE': 'Annulée'
    };
    
    return `<span class="badge ${badges[statut] || 'bg-secondary'}">${statusText[statut] || statut}</span>`;
}

export function getGameTypeBadge(type) {
    const badges = {
        'PC': 'bg-primary',
        'Console': 'bg-success'
    };
    
    return `<span class="badge ${badges[type] || 'bg-secondary'}">${type}</span>`;
}
