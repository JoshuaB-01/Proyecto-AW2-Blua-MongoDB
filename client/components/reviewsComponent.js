export function ReviewsModal(producto, reviews, purchasedProducts) {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const hasPurchased = purchasedProducts.includes(producto._id);
    
    return `
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div class="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                <h2 class="text-black text-2xl font-bold mb-4">Reseñas de ${producto.nombre}</h2>
                
                ${user ? (hasPurchased ? `
                    <div class="mb-4 p-4 bg-gray-100 rounded">
                        <h3 class="text-black font-bold mb-2">Agregar reseña</h3>
                        <select id="rating" class="text-black w-full mb-2 p-2 border rounded">
                            <option value="">Seleccione calificación</option>
                            <option value="1">★</option>
                            <option value="2">★★</option>
                            <option value="3">★★★</option>
                            <option value="4">★★★★</option>
                            <option value="5">★★★★★</option>
                        </select>
                        <textarea id="comment" class="text-black w-full p-2 border rounded mb-2" 
                                placeholder="Escriba su comentario"></textarea>
                        <button class="bg-green-500 text-white px-4 py-2 rounded"
                                onclick="agregarReseña('${producto._id}')">
                            Enviar reseña
                        </button>
                    </div>
                ` : `
                    <div class="mb-4 p-4 bg-yellow-100 rounded">
                        <p class="text-center">Para dejar una reseña, primero debes comprar este producto.</p>
                    </div>
                `) : ''}
                
                <div class="mb-4">
                    ${reviews.length > 0 ? reviews.map(review => `
                        <div class="border-b py-3">
                            <div class="text-black flex justify-between">
                                <span class="font-bold">${review.usuario.nombre} ${review.usuario.apellido}</span>
                                <span class="text-yellow-400">${'★'.repeat(review.calificacion)}</span>
                            </div>
                            <p class="text-black mt-2">${review.comentario}</p>
                            <span class="text-sm text-gray-500">
                                ${new Date(review.fecha).toLocaleDateString()}
                            </span>
                        </div>
                    `).join('') : '<p class="text-center">No hay reseñas todavía</p>'}
                </div>
                
                <button class="bg-blue-500 text-white px-4 py-2 rounded" onclick="cerrarModal()">
                    Cerrar
                </button>
            </div>
        </div>
    `;
}