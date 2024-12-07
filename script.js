// Función para obtener todos los productos y mostrarlos en la tabla
async function getProducts() {
    const response = await fetch('http://localhost:8080/productos');
    const products = await response.json();
    
    const productTable = document.getElementById('product-list');
    productTable.innerHTML = ''; // Limpia la tabla antes de agregar los productos

    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.nombre}</td>
            <td>${product.precio}</td>
            <td>${product.cantidad}</td>
            <td>${product.descripcion}</td>
            <td>
                <button onclick="editProduct(${product.id})">Editar</button>
                <button onclick="deleteProduct(${product.id})">Eliminar</button>
            </td>
        `;
        productTable.appendChild(row);
    });
}

// Función para agregar o actualizar un producto
async function saveProduct(event) {
    event.preventDefault(); // Evita que el formulario se envíe de forma tradicional
    console.log("Botón Guardar presionado"); 

    const id = document.getElementById('product-id').value;
    const nombre = document.getElementById('nombre').value;
    const precio = document.getElementById('precio').value;
    const cantidad = document.getElementById('cantidad').value;
    const descripcion = document.getElementById('descripcion').value;

    const product = { nombre, precio, cantidad, descripcion };
    const url = id ? `http://localhost:8080/productos/${id}` : 'http://localhost:8080/productos';
    const method = id ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
        });

        if (!response.ok) throw new Error('Error al guardar el producto');

        clearForm();
        getProducts(); // Actualiza la lista de productos
    } catch (error) {
        console.error(error);
        alert('Hubo un problema al guardar el producto.');
    }
}

// Función para rellenar el formulario con los datos del producto a editar
async function editProduct(id) {
    const response = await fetch(`http://localhost:8080/productos/${id}`);
    const product = await response.json();

    document.getElementById('product-id').value = product.id;
    document.getElementById('nombre').value = product.nombre;
    document.getElementById('precio').value = product.precio;
    document.getElementById('cantidad').value = product.cantidad;
    document.getElementById('descripcion').value = product.descripcion;
    document.getElementById('form-title').textContent = 'Editar Producto';
}

// Función para eliminar un producto
async function deleteProduct(id) {
    await fetch(`http://localhost:8080/productos/${id}`, { method: 'DELETE' });
    getProducts(); // Actualiza la lista de productos
}

// Función para limpiar el formulario
function clearForm() {
    document.getElementById('product-form').reset();
    document.getElementById('product-id').value = '';
    document.getElementById('form-title').textContent = 'Agregar Producto';
}

// Añade un evento al formulario para manejar el envío
document.getElementById('product-form').addEventListener('submit', saveProduct);

// Inicializa la lista de productos al cargar la página
getProducts();
