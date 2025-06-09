// ===== LOAD DATA FUNCTIONS =====
async function loadClients() {
    try {
      allClients = await getClients();
      renderClients();
      populateClientSelect();
    } catch (error) {
      showToast("Erreur lors du chargement des clients", "error");
    }
  }
  
  async function loadJeux() {
    try {
      allJeux = await getJeux();
      renderJeux();
      populateJeuSelect();
    } catch (error) {
      showToast("Erreur lors du chargement des jeux", "error");
    }
  }
  
  async function loadVentes() {
    try {
      allVentes = await getVentes();
      filteredVentes = allVentes;
      renderVentes();
    } catch (error) {
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
      const typeInfo = jeu.configurationMinimale ? 
        `Config: ${jeu.configurationMinimale}` : 
        `Plateforme: ${jeu.plateforme || 'N/A'}`;
      
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
    const select = $("#venteJeu");
    select.find('option:not(:first)').remove();
    
    allJeux.filter(jeu => jeu.stockDisponible > 0).forEach(jeu => {
      select.append(`<option value="${jeu.id}" data-prix="${jeu.prix}" data-stock="${jeu.stockDisponible}">
        ${jeu.titre} - ${formatPrice(jeu.prix)} (Stock: ${jeu.stockDisponible})
      </option>`);
    });
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
      
      const jeuData = {
        titre: $("#jeuTitre").val().trim(),
        prix: parseFloat($("#jeuPrix").val()),
        genre: $("#jeuGenre").val(),
        editeur: $("#jeuEditeur").val().trim(),
        stockDisponible: parseInt($("#jeuStock").val()),
        type: $("#jeuType").val()
      };
  
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
        await addJeu(jeuData);
        showToast("Jeu créé avec succès!");
        $("#jeuModal").modal("hide");
        $("#jeuForm")[0].reset();
        $("#pcFields, #consoleFields").hide();
        loadJeux();
      } catch (error) {
        showToast(error.message, "error");
      }
    });
  
    // Game type change handler
    $("#jeuType").on("change", function() {
      const selectedType = $(this).val();
      
      if (selectedType === 'PC') {
        $("#pcFields").show();
        $("#consoleFields").hide();
      } else if (selectedType === 'Console') {
        $("#pcFields").hide();
        $("#consoleFields").show();
      } else {
        $("#pcFields, #consoleFields").hide();
      }
    });
    
    // Vente preview calculation
    // Add a new game row to the transaction
    function addGameRow() {
      const rowId = Date.now(); // Unique ID for this row
      const gameRow = $(`
        <div class="game-row mb-3 p-3 border rounded" data-row-id="${rowId}">
          <div class="row">
            <div class="col-md-6">
              <label class="form-label">Jeu</label>
              <select class="form-control game-select" required>
                <option value="">Sélectionner un jeu</option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label">Quantité</label>
              <input type="number" class="form-control game-quantity" min="1" required />
            </div>
            <div class="col-md-2">
              <label class="form-label">&nbsp;</label>
              <button type="button" class="btn btn-danger btn-sm d-block remove-game-btn">
                🗑️ Supprimer
              </button>
            </div>
          </div>
          <div class="row mt-2">
            <div class="col-12">
              <small class="game-info text-muted"></small>
            </div>
          </div>
        </div>
      `);
      
      $("#gamesContainer").append(gameRow);
      populateGameSelect(gameRow.find(".game-select"));
      updateVentePreview();
    }
  
    // Remove game row
    $(document).on("click", ".remove-game-btn", function() {
      $(this).closest(".game-row").remove();
      updateVentePreview();
    });
  
    // Update game info when selection changes
    $(document).on("change", ".game-select, .game-quantity", function() {
      updateGameRowInfo($(this).closest(".game-row"));
      updateVentePreview();
    });
  
    // Update client selection
    $("#venteClient").on("change", updateVentePreview);
  
    // Populate game select dropdown
    function populateGameSelect(selectElement) {
      selectElement.find('option:not(:first)').remove();
      
      allJeux.filter(jeu => jeu.stockDisponible > 0).forEach(jeu => {
        selectElement.append(`
          <option value="${jeu.id}" data-prix="${jeu.prix}" data-stock="${jeu.stockDisponible}">
            ${jeu.titre} - ${formatPrice(jeu.prix)} (Stock: ${jeu.stockDisponible})
          </option>
        `);
      });
    }
  
    // Update game row info
    function updateGameRowInfo(gameRow) {
      const jeuSelect = gameRow.find(".game-select");
      const quantite = parseInt(gameRow.find(".game-quantity").val()) || 0;
      const selectedOption = jeuSelect.find("option:selected");
      const infoElement = gameRow.find(".game-info");
      
      if (selectedOption.val() && quantite > 0) {
        const prix = parseFloat(selectedOption.data("prix"));
        const stock = parseInt(selectedOption.data("stock"));
        const montantHT = quantite * prix;
        const montantTTC = montantHT * 1.20;
        
        if (quantite > stock) {
          infoElement.html(`<span class="text-danger">❌ Stock insuffisant! Disponible: ${stock}</span>`);
        } else {
          infoElement.html(`💰 Total: ${formatPrice(montantTTC)} TTC (${formatPrice(montantHT)} HT + TVA)`);
        }
      } else {
        infoElement.html("");
      }
    }
  
    // Update transaction preview
    function updateVentePreview() {
      const clientId = $("#venteClient").val();
      const selectedClient = allClients.find(c => c.id == clientId);
      const gameRows = $(".game-row");
      
      if (!selectedClient || gameRows.length === 0) {
        $("#ventePreview").hide();
        return;
      }
      
      let totalHT = 0;
      let gamesList = "";
      let hasStockIssue = false;
      
      gameRows.each(function() {
        const jeuSelect = $(this).find(".game-select");
        const quantite = parseInt($(this).find(".game-quantity").val()) || 0;
        const selectedOption = jeuSelect.find("option:selected");
        
        if (selectedOption.val() && quantite > 0) {
          const jeuTitre = selectedOption.text().split(" - ")[0];
          const prix = parseFloat(selectedOption.data("prix"));
          const stock = parseInt(selectedOption.data("stock"));
          const montantHT = quantite * prix;
          
          if (quantite > stock) {
            hasStockIssue = true;
            gamesList += `<li class="text-danger">${jeuTitre} x${quantite} - ❌ Stock insuffisant!</li>`;
          } else {
            totalHT += montantHT;
            gamesList += `<li>${jeuTitre} x${quantite} - ${formatPrice(montantHT)} HT</li>`;
          }
        }
      });
      
      if (gamesList) {
        const totalTTC = totalHT * 1.20;
        const tva = totalHT * 0.20;
        
        let previewHtml = `
          <strong>Client:</strong> ${selectedClient.nom} (${selectedClient.email})<br/>
          <strong>Jeux commandés:</strong>
          <ul>${gamesList}</ul>
        `;
        
        if (!hasStockIssue) {
          previewHtml += `
            <hr>
            <strong>Total HT:</strong> ${formatPrice(totalHT)}<br/>
            <strong>TVA (20%):</strong> ${formatPrice(tva)}<br/>
            <span class="text-success"><strong>Total TTC: ${formatPrice(totalTTC)}</strong></span>
          `;
        }
        
        $("#venteDetails").html(previewHtml);
        $("#ventePreview").show();
      } else {
        $("#ventePreview").hide();
      }
    }
  
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
    
    $(document).on("click", ".edit-jeu-btn", async function() {
      const id = $(this).data("id");
      const jeu = allJeux.find(j => j.id == id);
      
      const newStock = prompt(`Stock actuel: ${jeu.stockDisponible}\nNouveau stock:`, jeu.stockDisponible);
      
      if (newStock !== null && !isNaN(newStock) && newStock >= 0) {
        try {
          await updateJeu(id, { stockDisponible: parseInt(newStock) });
          showToast("Stock mis à jour!");
          loadJeux();
        } catch (error) {
          showToast(error.message, "error");
        }
      }
    });
  
    $(document).on("click", ".delete-jeu-btn", async function() {
      const id = $(this).data("id");
      const jeu = allJeux.find(j => j.id == id);
      
      if (confirm(`Êtes-vous sûr de vouloir supprimer le jeu "${jeu.titre}" ?\n\nCette action est irréversible.`)) {
        try {
          await deleteJeu(id);
          showToast("Jeu supprimé avec succès!");
          loadJeux();
          loadVentes(); // Refresh ventes in case deleted game was in sales
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
    });
  } 