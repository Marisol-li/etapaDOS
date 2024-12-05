window.onload = () => {
    // Recuperar el álbum seleccionado del localStorage
    const album = JSON.parse(localStorage.getItem('detalleAlbum'));
    if (!album) {
        alert('No hay detalles para mostrar.');
        window.location.href = 'index.html';
        return;
    }

    // Mostrar detalles del álbum en los elementos correspondientes
    document.getElementById('imagen-album').src = album.artworkUrl100;
    document.getElementById('imagen-album').alt = album.collectionName;
    document.getElementById('nombre-album').textContent = album.collectionName;
    document.getElementById('nombre-album-detalle').textContent = album.collectionName;
    document.getElementById('artista-album').textContent = album.artistName;
    document.getElementById('precio-album').textContent = `$${album.collectionPrice || 'N/A'}`;
    document.getElementById('descripcion-album').textContent = album.copyright || 'Descripción no disponible.';

    // Manejo de la cantidad de artículos
    const cantidadInput = document.getElementById('cantidad-album');
    const botonMenos = document.getElementById('boton-menos');
    const botonMas = document.getElementById('boton-mas');

    botonMenos.onclick = () => {
        let cantidad = parseInt(cantidadInput.value);
        if (cantidad > 1) {
            cantidadInput.value = cantidad - 1;
        }
        actualizarBotones();
    };

    botonMas.onclick = () => {
        let cantidad = parseInt(cantidadInput.value);
        if (cantidad < 6) {
            cantidadInput.value = cantidad + 1;
        }
        actualizarBotones();
    };

    const actualizarBotones = () => {
        const cantidad = parseInt(cantidadInput.value);
        botonMenos.disabled = cantidad <= 1;
        botonMas.disabled = cantidad >= 6;
    };

    actualizarBotones();

    // Acción del botón "Agregar al carrito"
    document.getElementById('agregar-carrito').onclick = () => {
        alert(`Se agregó ${cantidadInput.value} unidad(es) del álbum "${album.collectionName}" al 🛒.`);
    };
};
