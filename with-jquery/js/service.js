
const baseUrl = 'http://localhost/exemple';

const getEmployees = async () => {
    try {
        const response = await fetch(`${baseUrl}/api/v1/employees`, {
            method: "GET",
            redirect: "follow"
        });
        const result = await response.json();
        return result
    } catch (error) {
        console.error(error);

    }
}


async function deleteEmployee(id) {
    try {
        const response = await fetch(`${baseUrl}/api/v1/employees/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Delete failed');
        }

        return true;
    } catch (error) {
        console.error("Delete employee error:", error);
        return false;
    }
}


const augmentSalary = async (id, augmentation) => {
    const raw = JSON.stringify({
        augmentation
    });

    const requestOptions = {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
        },
        body: raw,
        redirect: "follow"
    };

    try {
        const response = await fetch(`${baseUrl}/api/v1/salaries/${id}`, requestOptions);
        await response.json();
        return true;
    } catch (error) {
        console.error(error);
    };
}

const editEmployee = async (id, data) => {
    const raw = JSON.stringify({
        ...data
    });

    const requestOptions = {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
        },
        body: raw,
        redirect: "follow"
    };

    try {
        const response = await fetch(`${baseUrl}/api/v1/employees/${id}`, requestOptions);
        await response.json();
        return true;
    } catch (error) {
        console.error(error);
    };
}

const getFile = (path) => {
    return `${baseUrl}/files/v1?path=${path}`
}

function showToast(message) {
    $('#liveToast .toast-body').text(message);

    const toastEl = document.getElementById('liveToast');
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}