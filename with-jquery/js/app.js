// ===== LOAD DATA FUNCTIONS =====
async function loadClients() {
  try {
    console.log("🔄 Chargement des clients...");
    allClients = await getClients();
    console.log("✅ Clients chargés:", allClients);
    renderClients();
    populateClientSelect();
    console.log("✅ Clients affichés");
  } catch (error) {
    console.error("❌ Erreur clients:", error);
    showToast("Erreur lors du chargement des clients", "error");
  }
}

async function loadJeux() {
  try {
    console.log("🔄 Chargement des jeux...");
    allJeux = await getJeux();
    console.log("✅ Jeux chargés:", allJeux);
    renderJeux();
    console.log("✅ Jeux affichés");
  } catch (error) {
    console.error("❌ Erreur jeux:", error);
    showToast("Erreur lors du chargement des jeux", "error");
  }
}

async function loadVentes() {
  try {
    console.log("🔄 Chargement des ventes...");
    allVentes = await getVentes();
    console.log("✅ Ventes chargées:", allVentes);
    filteredVentes = allVentes;
    renderVentes();
    console.log("✅ Ventes affichées");
  } catch (error) {
    console.error("❌ Erreur ventes:", error);
    showToast("Erreur lors du chargement des ventes", "error");
  }
}

// ===== RENDER FUNCTIONS =====
function renderClients(searchFilter = '') {
  const tbody = $("#clientTable");
  tbody.empty();
  
  const filtered = allClients.filter(client => 
    client.nom.toLowerCase().includes(searchFilter.toLowerCase()) ||
    client.email.toLowerCase().includes(searchFilter.toLowerCase())
  );
  
  filtered.forEach(client => {
    tbody.append(`
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
    `);
  });
}

function renderJeux(searchFilter = '') {
  const tbody = $("#jeuTable");
  tbody.empty();
  
  const filtered = allJeux.filter(jeu => 
    jeu.titre.toLowerCase().includes(searchFilter.toLowerCase()) ||
    jeu.genre.toLowerCase().includes(searchFilter.toLowerCase())
  );
  
  filtered.forEach(jeu => {
    const type = jeu.type || (jeu.configurationMinimale ? 'PC' : 'Console');
    
    tbody.append(`
      <tr>
        <td>
          <strong>${jeu.titre}</strong><br/>
          <small class="text-muted">${jeu.editeur}</small>
        </td>
        <td>${getGameTypeBadge(type)}</td>
        <td>${formatPrice(jeu.prix)}</td>
        <td>${jeu.genre}</td>
        <td>
          <span class="badge ${jeu.stockDisponible > 0 ? 'bg-success' : 'bg-danger'}">
            ${jeu.stockDisponible}
          </span>
        </td>
        <td>
          <button class="btn btn-warning btn-sm edit-jeu-btn" data-id="${jeu.id}">
            Stock
          </button>
          <button class="btn btn-danger btn-sm delete-jeu-btn" data-id="${jeu.id}">
            Supprimer
          </button>
        </td>
      </tr>
    `);
  });
}

function renderVentes() {
  const tbody = $("#venteTable");
  tbody.empty();
  
  filteredVentes.forEach(vente => {
    tbody.append(`
      <tr>
        <td>${formatDate(vente.dateVente)}</td>
        <td>${vente.clientNom || 'Client inconnu'}</td>
        <td>${vente.jeuTitre || 'Jeu inconnu'}</td>
        <td>${vente.quantite}</td>
        <td>${formatPrice(vente.montantTotal)}</td>
        <td>${getStatusBadge(vente.statut)}</td>
        <td>
          <button class="btn btn-primary btn-sm update-status-btn" data-id="${vente.id}">
            Modifier Statut
          </button>
          <button class="btn btn-danger btn-sm delete-vente-btn" data-id="${vente.id}">
            Supprimer
          </button>
        </td>
      </tr>
    `);
  });
}

// ===== POPULATE SELECTS =====
function populateClientSelect() {
  const select = $("#venteClient");
  select.find('option:not(:first)').remove();
  
  allClients.forEach(client => {
    select.append(`<option value="${client.id}">${client.nom} (${client.email})</option>`);
  });
}

function populateJeuSelect() {
  // Cette fonction n'est plus utilisée avec la structure actuelle
  // La sélection des jeux se fait dynamiquement dans addGameRow
}

// ===== EVENT HANDLERS =====
function setupEventHandlers() {
  // Search functionality
  $("#searchClient").on("input", function() {
    renderClients($(this).val());
  });
  
  $("#searchJeu").on("input", function() {
    renderJeux($(this).val());
  });
  
  // Vente filters
  $("[data-filter]").on("click", function() {
    const filter = $(this).data("filter");
    $("[data-filter]").removeClass("active");
    $(this).addClass("active");
    
    if (filter === "all") {
      filteredVentes = allVentes;
    } else {
      filteredVentes = allVentes.filter(vente => vente.statut === filter);
    }
    renderVentes();
  });
  
  // Client form submission
  $("#clientForm").on("submit", async function(e) {
    e.preventDefault();
    
    const nom = $("#clientNom").val().trim();
    const email = $("#clientEmail").val().trim();
    const phone = $("#clientPhone").val().trim();
    
    try {
      await addClient(nom, email, phone);
      showToast("Client ajouté avec succès!");
      $("#clientModal").modal("hide");
      $("#clientForm")[0].reset();
      loadClients();
    } catch (error) {
      showToast(error.message, "error");
    }
  });
  
  // Edit client form submission
  $("#editClientForm").on("submit", async function(e) {
    e.preventDefault();
    
    const id = $("#editClientId").val();
    const data = {
      nom: $("#editClientNom").val().trim(),
      email: $("#editClientEmail").val().trim(),
      phone: $("#editClientPhone").val().trim()
    };
    
    try {
      await editClient(id, data);
      showToast("Client modifié avec succès!");
      $("#editClientModal").modal("hide");
      loadClients();
    } catch (error) {
      showToast(error.message, "error");
    }
  });
  
  // Add game row button
  $("#addGameBtn").on("click", function() {
    addGameRow();
  });

  // Vente form submission - Multiple games
  $("#venteForm").on("submit", async function(e) {
    e.preventDefault();
    
    const clientId = $("#venteClient").val();
    const gameRows = $(".game-row");
    
    if (gameRows.length === 0) {
      showToast("Veuillez ajouter au moins un jeu à la transaction", "error");
      return;
    }
    
    const games = [];
    let hasError = false;
    
    gameRows.each(function() {
      const jeuId = $(this).find(".game-select").val();
      const quantite = parseInt($(this).find(".game-quantity").val());
      
      if (!jeuId || !quantite || quantite <= 0) {
        hasError = true;
        return false;
      }
      
      games.push({ jeuId, quantite });
    });
    
    if (hasError) {
      showToast("Veuillez remplir tous les champs de jeux correctement", "error");
      return;
    }
    
    try {
      // Create multiple ventes (one for each game)
      for (const game of games) {
        await addVente(clientId, game.jeuId, game.quantite);
      }
      
      showToast(`Transaction créée avec succès! ${games.length} vente(s) ajoutée(s).`);
      $("#venteModal").modal("hide");
      $("#venteForm")[0].reset();
      $("#gamesContainer").empty();
      $("#ventePreview").hide();
      loadVentes();
      loadJeux(); // Refresh for updated stock
    } catch (error) {
      showToast(error.message, "error");
    }
  });
  
  // Status form submission
  $("#statusForm").on("submit", async function(e) {
    e.preventDefault();
    
    const id = $("#statusVenteId").val();
    const statut = $("#statusSelect").val();
    
    try {
      await updateVenteStatus(id, statut);
      showToast("Statut mis à jour avec succès!");
      $("#statusModal").modal("hide");
      loadVentes();
    } catch (error) {
      showToast(error.message, "error");
    }
  });

  // Game form submission
  $("#jeuForm").on("submit", async function(e) {
    e.preventDefault();
    console.log("🎮 Formulaire jeu soumis!");
    
    const jeuData = {
      titre: $("#jeuTitre").val().trim(),
      prix: parseFloat($("#jeuPrix").val()),
      genre: $("#jeuGenre").val(),
      editeur: $("#jeuEditeur").val().trim(),
      stockDisponible: parseInt($("#jeuStock").val()),
      type: $("#jeuType").val()
    };
    
    console.log("📦 Données du jeu:", jeuData);

    // Add type-specific fields with validation
    if (jeuData.type === 'PC') {
      jeuData.configurationMinimale = $("#jeuConfigMin").val().trim();
      jeuData.supportDVD = $("#jeuSupportDVD").is(':checked');
      
      // Validate PC-specific required fields
      if (!jeuData.configurationMinimale) {
        showToast("Configuration minimale est requise pour les jeux PC", "error");
        return;
      }
    } else if (jeuData.type === 'Console') {
      jeuData.plateforme = $("#jeuPlateforme").val();
      jeuData.regionCode = $("#jeuRegionCode").val();
      
      // Validate Console-specific required fields
      if (!jeuData.plateforme) {
        showToast("Plateforme est requise pour les jeux Console", "error");
        return;
      }
      if (!jeuData.regionCode) {
        showToast("Code région est requis pour les jeux Console", "error");
        return;
      }
    }

    try {
      console.log("🚀 Appel de addJeu...");
      const result = await addJeu(jeuData);
      console.log("✅ Jeu créé:", result);
      showToast("Jeu créé avec succès!");
      $("#jeuModal").modal("hide");
      $("#jeuForm")[0].reset();
      $("#pcFields, #consoleFields").hide();
      loadJeux();
    } catch (error) {
      console.error("❌ Erreur création jeu:", error);
      showToast(error.message, "error");
    }
  });

  // Game type change handler
  $("#jeuType").on("change", function() {
    const selectedType = $(this).val();
    
    if (selectedType === 'PC') {
      // Afficher les champs PC et les rendre requis
      $("#pcFields").show();
      $("#consoleFields").hide();
      $("#jeuConfigMin").prop("required", true);
      $("#jeuPlateforme").prop("required", false);
      $("#jeuRegionCode").prop("required", false);
    } else if (selectedType === 'Console') {
      // Afficher les champs Console et les rendre requis
      $("#pcFields").hide();
      $("#consoleFields").show();
      $("#jeuConfigMin").prop("required", false);
      $("#jeuPlateforme").prop("required", true);
      $("#jeuRegionCode").prop("required", true);
    } else {
      // Cacher tous les champs spécifiques
      $("#pcFields, #consoleFields").hide();
      $("#jeuConfigMin").prop("required", false);
      $("#jeuPlateforme").prop("required", false);
      $("#jeuRegionCode").prop("required", false);
    }
  });
  
  // Dynamic event handlers
  $(document).on("click", ".remove-game-btn", function() {
    $(this).closest(".game-row").remove();
    updateVentePreview();
  });

  $(document).on("change", ".game-select, .game-quantity", function() {
    updateGameRowInfo($(this).closest(".game-row"));
    updateVentePreview();
  });

  $("#venteClient").on("change", updateVentePreview);

  // Initialize with one game row when modal opens
  $("#venteModal").on("shown.bs.modal", function() {
    if ($("#gamesContainer .game-row").length === 0) {
      addGameRow();
    }
  });
  
  // Button click handlers
  $(document).on("click", ".edit-client-btn", async function() {
    const id = $(this).data("id");
    const client = allClients.find(c => c.id == id);
    
    $("#editClientId").val(client.id);
    $("#editClientNom").val(client.nom);
    $("#editClientEmail").val(client.email);
    $("#editClientPhone").val(client.phone);
    $("#editClientModal").modal("show");
  });
  
  $(document).on("click", ".delete-client-btn", async function() {
    const id = $(this).data("id");
    const client = allClients.find(c => c.id == id);
    
    if (confirm(`Êtes-vous sûr de vouloir supprimer le client "${client.nom}" ?`)) {
      try {
        await deleteClient(id);
        showToast("Client supprimé avec succès!");
        loadClients();
      } catch (error) {
        showToast(error.message, "error");
      }
    }
  });
  

  
  $(document).on("click", ".update-status-btn", function() {
    const id = $(this).data("id");
    const vente = allVentes.find(v => v.id == id);
    
    // Show the status modal that's already defined in index.html
    $("#statusVenteId").val(id);
    $("#statusSelect").val(vente.statut);
    $("#statusModal").modal("show");
  });
  
  $(document).on("click", ".delete-vente-btn", async function() {
    const id = $(this).data("id");
    
    if (confirm("Êtes-vous sûr de vouloir supprimer cette vente ?")) {
      try {
        await fetch(`${baseUrl}/api/v1/ventes/${id}`, { method: "DELETE" });
        showToast("Vente supprimée avec succès!");
        loadVentes();
      } catch (error) {
        showToast("Erreur lors de la suppression", "error");
      }
    }
  });
  
  // Reset forms when modals are hidden
  $(".modal").on("hidden.bs.modal", function() {
    $(this).find("form")[0]?.reset();
    $("#ventePreview").hide();
    
    // Réinitialiser les champs de jeu
    if ($(this).attr("id") === "jeuModal") {
      $("#pcFields, #consoleFields").hide();
      $("#jeuConfigMin").prop("required", false);
      $("#jeuPlateforme").prop("required", false);
      $("#jeuRegionCode").prop("required", false);
    }
    
    // Corriger le problème aria-hidden en supprimant le focus des éléments à l'intérieur
    $(this).find("*").blur();
  });

  // Événement avant la fermeture du modal pour gérer le focus
  $(".modal").on("hide.bs.modal", function() {
    // Supprimer le focus de tous les éléments dans le modal avant fermeture
    $(this).find("button, input, select, textarea").blur();
    
    // Remettre le focus sur le body pour éviter les conflits
    document.body.focus();
  });

  // Événement à l'ouverture du modal pour s'assurer de la bonne gestion
  $(".modal").on("shown.bs.modal", function() {
    // S'assurer que le modal peut recevoir le focus
    $(this).removeAttr("aria-hidden");
    
    // Focus sur le premier champ de saisie du modal
    $(this).find("input, select, textarea").first().focus();
  });
}

// ===== GESTIONNAIRES D'ÉVÉNEMENTS JEUX (EN DEHORS DE setupEventHandlers) =====
$(document).on("click", ".edit-jeu-btn", async function() {
  console.log("🎮 Bouton Edit Jeu cliqué!");
  const id = $(this).data("id");
  const jeu = allJeux.find(j => j.id == id);
  
  if (!jeu) {
    showToast("Jeu non trouvé!", "error");
    return;
  }
  
  console.log("📦 Jeu trouvé:", jeu);
  const newStock = prompt(`Stock actuel: ${jeu.stockDisponible}\nNouveau stock:`, jeu.stockDisponible);
  
  if (newStock !== null && !isNaN(newStock) && newStock >= 0) {
    try {
      console.log("🔄 Mise à jour du stock...", { id, newStock: parseInt(newStock) });
      await updateJeu(id, { stockDisponible: parseInt(newStock) });
      showToast("Stock mis à jour!");
      loadJeux();
    } catch (error) {
      console.error("❌ Erreur mise à jour stock:", error);
      showToast(error.message, "error");
    }
  }
});

$(document).on("click", ".delete-jeu-btn", async function() {
  console.log("🗑️ Bouton Delete Jeu cliqué!");
  const id = $(this).data("id");
  const jeu = allJeux.find(j => j.id == id);
  
  if (!jeu) {
    showToast("Jeu non trouvé!", "error");
    return;
  }
  
  console.log("📦 Jeu à supprimer:", jeu);
  if (confirm(`Êtes-vous sûr de vouloir supprimer le jeu "${jeu.titre}" ?\n\nCette action est irréversible.`)) {
    try {
      console.log("🗑️ Suppression du jeu...", id);
      await deleteJeu(id);
      showToast("Jeu supprimé avec succès!");
      loadJeux();
      loadVentes(); // Refresh ventes in case deleted game was in sales
    } catch (error) {
      console.error("❌ Erreur suppression:", error);
      showToast(error.message, "error");
    }
  }
}); 