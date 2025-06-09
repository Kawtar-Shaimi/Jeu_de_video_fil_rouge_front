const baseUrl = 'http://localhost/exemple';

export const getEmployees = async () => {
    const response = await fetch(`${baseUrl}/api/v1/employees`);
    return response.json();
};

export const deleteEmployee = async (id) => {
    const response = await fetch(`${baseUrl}/api/v1/employees/${id}`, {
        method: 'DELETE',
    });
    return response.ok;
};

export const augmentSalary = async (id, augmentation) => {
    const response = await fetch(`${baseUrl}/api/v1/salaries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ augmentation }),
    });
    return response.ok;
};

export const editEmployee = async (id, data) => {
    const response = await fetch(`${baseUrl}/api/v1/employees/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return response.ok;
};

export const addEmployee = async (formData) => {
    const response = await fetch(`${baseUrl}/api/v1/employees`, {
        method: 'POST',
        body: formData,
    });
    return response.ok;
};

export const getFile = (path) => `${baseUrl}/files/v1?path=${path}`;