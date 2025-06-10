const baseUrl = 'http://localhost:8000';

export const getJeux = async () => {
    const response = await fetch(`${baseUrl}/api/v1/jeus`);
    return response.json();
};

export const getJeu = async (id) => {
    const response = await fetch(`${baseUrl}/api/v1/jeus/${id}`);
    return response.json();
};

export const addJeu = async (data) => {
    const response = await fetch(`${baseUrl}/api/v1/jeus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return response.ok;
};

export const editJeu = async (id, data) => {
    const response = await fetch(`${baseUrl}/api/v1/jeus/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return response.ok;
};

export const deleteJeu = async (id) => {
    const response = await fetch(`${baseUrl}/api/v1/jeus/${id}`, {
        method: 'DELETE',
    });
    return response.ok;
}; 