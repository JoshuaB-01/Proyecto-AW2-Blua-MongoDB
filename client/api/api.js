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
  console.log('Token al crear orden:', token);

  if (!token) {
    alert('No se encontró token de sesión');
    throw new Error('No hay sesión activa');
  }

  try {
    console.log('Enviando orden con token:', token);
    const response = await fetch(`${BASE_URL}/orders/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(ordenData),
    });

    const data = await response.json();
    console.log('Respuesta del servidor:', response.status, data);

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







