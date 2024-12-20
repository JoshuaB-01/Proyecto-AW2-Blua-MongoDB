import { CardComponent } from '../components/cardComponent.js';
import { NavbarComponent, initMobileMenu } from '../components/navbarComponent.js';
import { FooterComponent } from '../components/footerComponent.js';
import { getData, setData } from '../utils/localStorage.controller.js';
import { fetchProductos, getProductReviews, createReview, getUserPurchases } from '../api/api.js';
import { ReviewsModal } from '../components/reviewsComponent.js';

let productos = [];

async function inicializarCategorias() {
    renderizarNavbar();
    renderizarFooter();
    await cargarCategorias();
    initMobileMenu();
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

async function cargarCategorias() {
    try {
        productos = await fetchProductos();
        
        const categorias = [...new Set(productos.map(producto => producto.categoria))];
        
        const contenedorCategorias = document.getElementById('contenedor-categorias');
        
        let htmlCategorias = '<button class="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded mr-2" onclick="cargarProductosPorCategoria(\'todas\')">Todas</button>';
        categorias.forEach(categoria => {
            htmlCategorias += `
                <button class="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded mr-2"
                        onclick="cargarProductosPorCategoria('${categoria}')">
                    ${categoria}
                </button>
            `;
        });
        
        contenedorCategorias.innerHTML = htmlCategorias;
        cargarProductosPorCategoria('todas');
    } catch (error) {
        console.error('Error al cargar las categorías:', error);
    }
}

async function cargarProductosPorCategoria(categoria) {
    try {
        if (productos.length === 0) {
            productos = await fetchProductos();
        }

        const productosFiltrados = categoria === 'todas' ? 
            productos : productos.filter(producto => producto.categoria === categoria);
        
        const contenedorProductos = document.getElementById('contenedor-productos');
        
        let htmlProductos = '';
        productosFiltrados.forEach(producto => {
            htmlProductos += CardComponent(producto);
        });
        
        contenedorProductos.innerHTML = htmlProductos;
    } catch (error) {
        console.error('Error al cargar los productos:', error);
    }
}

window.agregarAlCarrito = function(productId) {
    let cantidad = parseInt(document.getElementById(`cantidad-${productId}`).value);

    if (cantidad > 0) {
        let carrito = getData('carrito') || [];
        const productoExistente = carrito.find(producto => producto._id === productId);
        
        if (productoExistente) {
            productoExistente.cantidad += cantidad;
            productoExistente.total = productoExistente.precio * productoExistente.cantidad;
        } else {
            const producto = productos.find(producto => producto._id === productId);
            carrito.push({
                _id: productId,
                nombre: producto.nombre,
                precio: producto.precio,
                cantidad: cantidad,
                total: producto.precio * cantidad
            });
        }
        
        setData('carrito', carrito);
        alert('Producto agregado al carrito');
    } else {
        alert('Por favor, ingrese una cantidad válida');
    }
}

window.mostrarReseñas = async function(productId) {
    try {
        const [reviews, purchasedProducts] = await Promise.all([
            getProductReviews(productId),
            getUserPurchases()
        ]);
        const producto = productos.find(p => p._id === productId);
        
        const modalContainer = document.createElement('div');
        modalContainer.id = 'reviewsModal';
        modalContainer.innerHTML = ReviewsModal(producto, reviews, purchasedProducts);
        document.body.appendChild(modalContainer);
    } catch (error) {
        console.error('Error al cargar reseñas:', error);
        alert('Error al cargar las reseñas');
    }
}

window.cerrarModal = function() {
    const modal = document.getElementById('reviewsModal');
    if (modal) {
        modal.remove();
    }
}

window.agregarReseña = async function(productId) {
    const calificacion = document.getElementById('rating').value;
    const comentario = document.getElementById('comment').value;
    
    if (!calificacion || !comentario) {
        alert('Por favor complete todos los campos');
        return;
    }

    try {
        await createReview({
            producto: productId,
            calificacion: parseInt(calificacion),
            comentario
        });
        
        alert('Reseña agregada exitosamente');
        cerrarModal();
        mostrarReseñas(productId);
    } catch (error) {
        console.error('Error al agregar reseña:', error);
        alert('Error al agregar la reseña');
    }
}

document.addEventListener('DOMContentLoaded', inicializarCategorias);
window.cargarProductosPorCategoria = cargarProductosPorCategoria;