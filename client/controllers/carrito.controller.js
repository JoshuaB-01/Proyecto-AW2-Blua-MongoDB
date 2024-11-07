import { getData, deleteCollection } from '../utils/localStorage.controller.js';
import { NavbarComponent } from '../components/navbarComponent.js';
import { FooterComponent } from '../components/footerComponent.js';
import { crearOrden } from '../api/api.js';

async function inicializarCarrito() {
    renderizarNavbar();
    renderizarFooter();
    cargarCarrito();
    agregarEventListeners();
}

function renderizarNavbar() {
    const headerElement = document.querySelector('header');
    if (headerElement) {
        headerElement.innerHTML = NavbarComponent();
    }
}

function renderizarFooter() {
    const footerElement = document.querySelector('footer');
    if (footerElement) {
        footerElement.innerHTML = FooterComponent();
    }
}

function agregarEventListeners() {
    const btnVaciar = document.getElementById('vaciarCarrito');
    const btnComprar = document.getElementById('comprar');
    
    if (btnVaciar) btnVaciar.addEventListener('click', vaciarCarrito);
    if (btnComprar) btnComprar.addEventListener('click', comprar);
}

function cargarCarrito() {
    const carrito = getData('carrito') || [];
    const tablaCarrito = document.getElementById('tabla-carrito');

    if (!tablaCarrito) return;

    tablaCarrito.innerHTML = '';

    if (carrito.length === 0) {
        tablaCarrito.innerHTML = '<tr><td colspan="3" class="text-center">El carrito está vacío.</td></tr>';
        return;
    }

    carrito.forEach(item => {
        const fila = tablaCarrito.insertRow();
        fila.innerHTML = `
            <td class="py-2 text-center text-black">${item.nombre}</td>
            <td class="py-2 text-center text-black">${item.cantidad}</td>
            <td class="py-2 text-center text-black">$${item.total ? item.total.toFixed(2) : '0.00'}</td>
        `;
    });
}

function vaciarCarrito() {
    deleteCollection('carrito');
    alert('Carrito vaciado');
    location.reload();
}

async function comprar() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(sessionStorage.getItem('user'));
    console.log('Iniciando compra con token:', token);
    console.log('Usuario:', user);

    if (!token || !user) {
        alert('No hay sesión activa. Por favor, inicie sesión.');
        window.location.href = "../index.html";
        return;
    }

    try {
        const carrito = getData('carrito') || [];
        if (carrito.length === 0) {
            alert('El carrito está vacío');
            return;
        }

        const ordenData = {
            usuario: {
                id: user.id,
                nombre: user.nombre,
                apellido: user.apellido,
                email: user.email
            },
            items: carrito.map(item => ({
                id: item.id,
                nombre: item.nombre,
                cantidad: item.cantidad,
                precio: item.precio,
                total: item.total
            }))
        };

        console.log('Datos de la orden:', ordenData);
        const result = await crearOrden(ordenData);
        console.log('Resultado de la orden:', result);

        if (result && result.order) {
            alert(`Compra realizada con éxito. Número de orden: ${result.order._id}`);
            vaciarCarrito();
        } else {
            alert('Error en la respuesta del servidor');
        }
    } catch (error) {
        console.error('Error en compra:', error);
        if (error.message.includes('Sesión')) {
            window.location.href = "../index.html";
        } else {
            alert('Hubo un error al procesar su compra. Por favor, intente nuevamente.');
        }
    }
}

document.addEventListener('DOMContentLoaded', inicializarCarrito);