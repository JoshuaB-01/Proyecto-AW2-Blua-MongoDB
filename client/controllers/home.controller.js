import { CardComponent } from '../components/cardComponent.js';
import { NavbarComponent } from '../components/navbarComponent.js';
import { FooterComponent } from '../components/footerComponent.js';
import { getData, setData } from '../utils/localStorage.controller.js';
import { fetchProductos, getProductReviews, createReview, getUserPurchases } from '../api/api.js';
import { ReviewsModal } from '../components/reviewsComponent.js';

let productos = [];

async function inicializarHome() {
    renderizarNavbar();
    renderizarFooter();
    await cargarProductos();
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

async function cargarProductos() {
    try {
        productos = await fetchProductos();
        const contenedorProductos = document.getElementById('contenedor-productos');
        
        let htmlProductos = '';
        productos.forEach(producto => {
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

document.addEventListener('DOMContentLoaded', inicializarHome);