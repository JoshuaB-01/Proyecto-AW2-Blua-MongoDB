const BASE_URL = 'http://localhost:3001';

export const fetchProductos = async () => {
    try {
        const response = await fetch(`${BASE_URL}/products`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }
        return await response.json();
    } catch (error) {
        console.error('Error al obtener productos:', error);
        throw error;
    }
};

export const crearOrden = async (ordenData) => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('No se encontró token de sesión');
        throw new Error('No hay sesión activa');
    }

    try {
        const response = await fetch(`${BASE_URL}/orders/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(ordenData),
        });

        const data = await response.json();

        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem('token');
                sessionStorage.removeItem('user');
                alert('Sesión expirada o inválida. Por favor, inicie sesión nuevamente.');
                window.location.href = "../index.html";
                throw new Error('Sesión expirada o inválida');
            }
            throw new Error(data.error || 'Error al procesar la orden');
        }

        return data;
    } catch (error) {
        console.error('Error detallado:', error);
        throw error;
    }
};

export const createReview = async (reviewData) => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${BASE_URL}/reviews/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(reviewData)
        });

        if (!response.ok) {
            throw new Error('Error al crear la reseña');
        }

        return await response.json();
    } catch (error) {
        console.error('Error al crear reseña:', error);
        throw error;
    }
};

export const getProductReviews = async (productId) => {
    try {
        const response = await fetch(`${BASE_URL}/reviews/product/${productId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error detallado al obtener reseñas:', error);
        throw error;
    }
};

export const getUserPurchases = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${BASE_URL}/orders/user-purchases`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error detallado al obtener compras:', error);
        throw error;
    }
};