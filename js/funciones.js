const categorias = [
    { nombre: 'Rock', artistas: ['Nirvana', 'Queen', 'Pink Floyd'] },
    { nombre: 'Rap', artistas: ['Kendrick Lamar', 'Playboi Carti', 'Eminem'] },
    { nombre: 'Pop', artistas: ['Ariana Grande', 'Taylor Swift', 'Michael Jackson'] }
];

const albumesSeleccionados = new Set();

// Mostrar categorías en el encabezado
const mostrarCategoriasHeader = () => {
    const listaCategorias = document.getElementById('lista-categorias');
    categorias.forEach(categoria => {
        const li = document.createElement('li');
        li.textContent = categoria.nombre;
        li.onclick = () => mostrarArtistas(categoria.artistas);
        listaCategorias.appendChild(li);
    });
};

// Mostrar artistas
const mostrarArtistas = (artistas) => {
    const contenedorArtistas = document.getElementById('artistas');
    contenedorArtistas.innerHTML = '';
    artistas.forEach(artista => {
        const div = document.createElement('div');
        div.classList.add('tarjeta');
        div.innerHTML = `
            <h3>${artista}</h3>
            <button onclick="buscarAlbumes('${artista}')">Ver álbumes</button>
        `;
        contenedorArtistas.appendChild(div);
    });
};

// Buscar álbumes
const buscarAlbumes = async (nombreArtista) => {
    const contenedorAlbumes = document.getElementById('albumes');
    contenedorAlbumes.innerHTML = '';
    try {
        const respuesta = await axios.get(`https://itunes.apple.com/search?term=${encodeURIComponent(nombreArtista)}&entity=album&limit=8`);
        const albumes = respuesta.data.results;
        if (albumes.length === 0) {
            alert('No se encontraron álbumes.');
            return;
        }
        albumes.forEach(album => {
            const div = document.createElement('div');
            div.classList.add('tarjeta');
            div.innerHTML = `
                <img src="${album.artworkUrl100}" alt="${album.collectionName}">
                <h3>${album.collectionName}</h3>
                <button onclick="gestionarAlbum('${album.collectionId}', this)">Agregar</button>
                <button onclick="verDetalle(${JSON.stringify(album).replace(/"/g, '&quot;')})">Ver Detalles</button>
            `;
            contenedorAlbumes.appendChild(div);
        });
    } catch (error) {
        console.error('Error al buscar álbumes:', error);
    }
};

// Ver detalles
const verDetalle = (album) => {
    localStorage.setItem('detalleAlbum', JSON.stringify(album));
    window.location.href = 'detalle.html';
};

// Manejo de la barra de progreso
const gestionarAlbum = (albumId, boton) => {
    if (albumesSeleccionados.has(albumId)) {
        albumesSeleccionados.delete(albumId);
        boton.textContent = 'Agregar';
    } else {
        if (albumesSeleccionados.size >= 10) {
            alert('Solo puedes agregar hasta 10 álbumes.');
            return;
        }
        albumesSeleccionados.add(albumId);
        boton.textContent = 'Des-agregar';
    }
    actualizarBarraProgreso();
};

// Actualizar barra de progreso
const actualizarBarraProgreso = () => {
    const progreso = document.getElementById('progreso');
    const porcentaje = (albumesSeleccionados.size / 10) * 100;
    progreso.style.width = `${porcentaje}%`;
    progreso.textContent = `${albumesSeleccionados.size}/10`;
};

// Buscar artistas
const buscarArtista = async () => {
    const nombreArtista = document.getElementById('nombre-artista').value.trim();
    if (!nombreArtista) {
        alert('Por favor, ingresa el nombre de un artista.');
        return;
    }
    buscarAlbumes(nombreArtista);
};

// Inicializar
window.onload = () => {
    mostrarCategoriasHeader();
};
