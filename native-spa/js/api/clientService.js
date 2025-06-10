const baseUrl = 'http://localhost:8000';

export const getClients = async () => {
    const response = await fetch(`${baseUrl}/api/v1/clients`);
    return response.json();
};

export const getClient = async (id) => {
    const response = await fetch(`${baseUrl}/api/v1/clients/${id}`);
    return response.json();
};

export const addClient = async (data) => {
    const response = await fetch(`${baseUrl}/api/v1/clients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return response.ok;
};

export const editClient = async (id, data) => {
    const response = await fetch(`${baseUrl}/api/v1/clients/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return response.ok;
};

export const deleteClient = async (id) => {
    const response = await fetch(`${baseUrl}/api/v1/clients/${id}`, {
        method: 'DELETE',
    });
    return response.ok;
}; 