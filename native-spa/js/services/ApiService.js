const baseUrl = "http://localhost:8080";

export class ApiService {
    
    // ===== CLIENTS =====
    static async getClients(search = null) {
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

    static async addClient(nom, email, phone) {
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

    static async updateClient(id, data) {
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

    static async deleteClient(id) {
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
    static async getGames(search = null) {
        try {
            let url = `${baseUrl}/api/v1/jeus`; // Backend génère "jeus"
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

    static async updateGame(id, data) {
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

    // ===== VENTES =====
    static async getSales() {
        try {
            const response = await fetch(`${baseUrl}/api/v1/ventes`);
            if (!response.ok) throw new Error("Failed to fetch sales");
            return await response.json();
        } catch (error) {
            console.error("Error fetching sales:", error);
            return [];
        }
    }

    static async addSale(clientId, jeuId, quantite) {
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

    static async updateSaleStatus(id, statut) {
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

    static async deleteSale(id) {
        try {
            const response = await fetch(`${baseUrl}/api/v1/ventes/${id}`, {
                method: "DELETE",
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to delete sale");
            }
            return await response.json();
        } catch (error) {
            console.error("Error deleting sale:", error);
            throw error;
        }
    }
} 