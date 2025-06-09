const baseUrl = "http://localhost:8080";

// ===== CLIENTS =====
async function getClients(search = null) {
  try {
    let url = `${baseUrl}/api/v1/clients`;
    if (search) {
      url += `?search=${encodeURIComponent(search)}`;
    }
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch clients");
    return await response.json();
  } catch (error) {
    console.error("Error fetching clients:", error);
    return [];
  }
}

async function getClient(id) {
  try {
    const response = await fetch(`${baseUrl}/api/v1/clients/${id}`);
    if (!response.ok) throw new Error("Failed to fetch client");
    return await response.json();
  } catch (error) {
    console.error("Error fetching client:", error);
    return null;
  }
}

async function addClient(nom, email, phone) {
  try {
    const response = await fetch(`${baseUrl}/api/v1/clients`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nom, email, phone }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to add client");
    }
    return await response.json();
  } catch (error) {
    console.error("Error adding client:", error);
    throw error;
  }
}

async function editClient(id, data) {
  try {
    const response = await fetch(`${baseUrl}/api/v1/clients/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update client");
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating client:", error);
    throw error;
  }
}

async function deleteClient(id) {
  try {
    const response = await fetch(`${baseUrl}/api/v1/clients/${id}`, {
      method: "DELETE",
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to delete client");
    }
    return await response.json();
  } catch (error) {
    console.error("Error deleting client:", error);
    throw error;
  }
}

// ===== JEUX =====
async function getJeux(search = null) {
  try {
    let url = `${baseUrl}/api/v1/jeus`; // Note: le backend génère "jeus" au lieu de "jeux"
    if (search) {
      url += `?search=${encodeURIComponent(search)}`;
    }
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch games");
    return await response.json();
  } catch (error) {
    console.error("Error fetching games:", error);
    return [];
  }
}

async function getJeu(id) {
  try {
    const response = await fetch(`${baseUrl}/api/v1/jeus/${id}`);
    if (!response.ok) throw new Error("Failed to fetch game");
    return await response.json();
  } catch (error) {
    console.error("Error fetching game:", error);
    return null;
  }
}

async function addJeu(jeuData) {
  try {
    const response = await fetch(`${baseUrl}/api/v1/jeus`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jeuData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create game");
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating game:", error);
    throw error;
  }
}

async function updateJeu(id, data) {
  try {
    const response = await fetch(`${baseUrl}/api/v1/jeus/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update game");
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating game:", error);
    throw error;
  }
}

async function deleteJeu(id) {
  try {
    const response = await fetch(`${baseUrl}/api/v1/jeus/${id}`, {
      method: "DELETE",
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to delete game");
    }
    return await response.json();
  } catch (error) {
    console.error("Error deleting game:", error);
    throw error;
  }
}

// ===== VENTES =====
async function getVentes() {
  try {
    const response = await fetch(`${baseUrl}/api/v1/ventes`);
    if (!response.ok) throw new Error("Failed to fetch sales");
    return await response.json();
  } catch (error) {
    console.error("Error fetching sales:", error);
    return [];
  }
}

async function getVente(id) {
  try {
    const response = await fetch(`${baseUrl}/api/v1/ventes/${id}`);
    if (!response.ok) throw new Error("Failed to fetch sale");
    return await response.json();
  } catch (error) {
    console.error("Error fetching sale:", error);
    return null;
  }
}

async function addVente(clientId, jeuId, quantite) {
  try {
    const response = await fetch(`${baseUrl}/api/v1/ventes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ clientId, jeuId, quantite }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create sale");
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating sale:", error);
    throw error;
  }
}

async function updateVenteStatus(id, statut) {
  try {
    const response = await fetch(`${baseUrl}/api/v1/ventes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ statut }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update sale status");
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating sale status:", error);
    throw error;
  }
}

// ===== UTILITY FUNCTIONS =====
function showToast(message, type = "success") {
  const toast = $("#liveToast");
  const toastBody = toast.find(".toast-body");
  
  toastBody.text(message);
  
  // Change toast style based on type
  toast.removeClass("text-bg-success text-bg-danger text-bg-warning text-bg-info");
  switch(type) {
    case "error":
      toast.addClass("text-bg-danger");
      break;
    case "warning":
      toast.addClass("text-bg-warning");
      break;
    case "info":
      toast.addClass("text-bg-info");
      break;
    default:
      toast.addClass("text-bg-success");
  }
  
  const bsToast = new bootstrap.Toast(toast[0]);
  bsToast.show();
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR') + ' ' + date.toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'});
}

function formatPrice(price) {
  return parseFloat(price).toFixed(2) + ' €';
}

function getStatusBadge(statut) {
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

function getGameTypeBadge(type) {
  const badges = {
    'PC': 'bg-primary',
    'Console': 'bg-success'
  };
  
  return `<span class="badge ${badges[type] || 'bg-secondary'}">${type}</span>`;
}

// ===== GLOBAL VARIABLES =====
let allClients = [];
let allJeux = [];
let allVentes = [];
let filteredVentes = [];