const baseUrl = 'http://localhost:8000';

export const getVentes = async () => {
    const response = await fetch(`${baseUrl}/api/v1/ventes`);
    return response.json();
};

export const getVente = async (id) => {
    const response = await fetch(`${baseUrl}/api/v1/ventes/${id}`);
    return response.json();
};

export const addVente = async (data) => {
    const response = await fetch(`${baseUrl}/api/v1/ventes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return response.ok;
};

export const editVente = async (id, data) => {
    const response = await fetch(`${baseUrl}/api/v1/ventes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return response.ok;
};

export const deleteVente = async (id) => {
    const response = await fetch(`${baseUrl}/api/v1/ventes/${id}`, {
        method: 'DELETE',
    });
    return response.ok;
}; 