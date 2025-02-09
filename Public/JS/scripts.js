document.addEventListener('DOMContentLoaded', () => {
    // Obtener todos los botones de navegación y sus contenedores asociados
    const navigationButtons = document.querySelectorAll('.navigation__button');
    const menuContainers = document.querySelectorAll('.main-menu__container');
    const mainMenuButtons = document.querySelectorAll('.main-menu__button');

    // Función para manejar clics en los botones de navegación
    const handleNavigationClick = (event) => {
        // Deshabilitar todos los botones de navegación y restablecer el color
        navigationButtons.forEach(button => {
            button.disabled = false;
            button.style.backgroundColor = ''; // Restablece el color por defecto
            button.style.fontWeight = ''; // Restablece el peso de la fuente
        });

        // Ocultar todos los contenedores
        menuContainers.forEach(container => {
            container.style.display = 'none';
        });

        // Cambiar el color y deshabilitar el botón clickeado
        const clickedButton = event.target;
        clickedButton.style.backgroundColor = '#D6F5A8';
        clickedButton.style.fontWeight = 'bold'; // Cambia a negrita
        clickedButton.disabled = true;

        // Mostrar el contenedor correspondiente al botón clickeado
        const buttonId = clickedButton.closest('.navigation__button-item').id;
        const correspondingContainerId = buttonId.replace('button-', 'menu-container-');
        const correspondingContainer = document.getElementById(correspondingContainerId);
        if (correspondingContainer) {
            correspondingContainer.style.display = 'flex';
        }
    };

    // Función para manejar clics en los botones del menú principal
    const handleMainMenuClick = (event) => {
        // Restablecer el color de todos los botones del menú principal
        mainMenuButtons.forEach(button => {
            button.style.backgroundColor = ''; // Restablece el color por defecto
        });

        // Cambiar el color del botón clickeado
        const clickedButton = event.target;
        clickedButton.style.backgroundColor = '#D6F5A8';
        clickedButton.style.fontWeight = 'bold'; // Cambia a negrita
    };

    // Agregar eventos de clic a los botones de navegación
    navigationButtons.forEach(button => {
        button.addEventListener('click', handleNavigationClick);
    });

    // Agregar eventos de clic a los botones del menú principal
    mainMenuButtons.forEach(button => {
        button.addEventListener('click', handleMainMenuClick);
    });
});

//--FORMATO DE SEPARACION DE MILES--
const inputs = document.querySelectorAll('.formatear');

inputs.forEach(input => {
    input.addEventListener('input', () => {
        // Eliminar caracteres no numéricos
        let valor = input.value.replace(/[^0-9.]/g, '').replace(/\B(?=(\d{3})+(?!\d)\.?)/g, ",");

        // Asegurarse de que solo hay un punto decimal
        if (valor.split(',').length > 2) {
            valor = valor.replace(/\.+$/, ''); // Elimina puntos adicionales al final
        }

        // Separar la parte entera y la decimal
        let [entero, decimal] = valor.split('.');

        // Formatear la parte entera con separadores de miles
        if (entero) {
            entero = entero.replace(/\B(?=(\d{3})+(?!\d)\.?)/g, ".");
        }

        // Limitar los decimales a dos dígitos
        if (decimal) {
            decimal = decimal.substring(0, 2);
        }

        // Reconstruir el valor formateado
        input.value = decimal !== undefined ? `${entero}.${decimal}` : entero;
    
    });

});


// =========================MOSTRAR Y OCULTAR FORMULARIO===========================

// Seleccionar los elementos
// const botonesMostrar = document.querySelectorAll('.main-menu__button--factura-venta, .main-menu__button--usuarios');
// const formularios = document.querySelectorAll('.form__facVenta, .form__usuario, .form__gestion-productos'); // Seleccionar formularios
// const botonesCerrar = document.querySelectorAll('.form__button-cerrar'); // Seleccionar botones para cerrar formularios

// // Mostrar el formulario correspondiente
// botonesMostrar.forEach((boton, index) => {
//   boton.addEventListener('click', (event) => {
//     formularios[index].style.display = 'flex'; // Mostrar el formulario correspondiente
//     boton.disabled = true; // Desactivar el botón para evitar clics repetidos
//   });
// });

// // Cerrar el formulario correspondiente
// botonesCerrar.forEach((boton, index) => {
//   boton.addEventListener('click', () => {
//     formularios[index].style.display = 'none'; // Ocultar el formulario correspondiente
//     botonesMostrar[index].disabled = false; // Reactivar el botón
//     console.log(`Formulario ${index + 1} cerrado.`);
//   });
// });



let filaSeleccionada = null; // Variable para almacenar la fila seleccionada

document.getElementById('agregarProducto').addEventListener('click', function (event) {
    event.preventDefault();

    // Obtener valores del formulario
    const codigo = document.getElementById('fCodigo').value.trim();
    const nombreProducto = document.getElementById('fNombreProducto').value.trim();
    const categoria = document.getElementById('fCategoria').value.trim();
    const cantidad = parseFloat(document.getElementById('cantidad').value.replace(/,/g, '')) || 0;
    const precio = parseFloat(document.getElementById('fPrecio').value.replace(/,/g, '')) || 0;
    const descuento = parseFloat(document.getElementById('descuento').value.replace(/,/g, '')) || 0;

    // Calcular subtotal
    const subtotal = (cantidad * precio) - descuento;

    if (cantidad <= 0 || precio <= 0) {
        alert("Por favor, ingrese valores válidos para la cantidad y el precio.");
        return;
    }

    if (filaSeleccionada) {
        // Actualizar la fila seleccionada
        filaSeleccionada.querySelector('.factura__tabla-productos-codigo').textContent = codigo;
        filaSeleccionada.querySelector('.factura__tabla-productos-nombre').textContent = nombreProducto;
        filaSeleccionada.querySelector('.factura__tabla-productos-categoria').textContent = categoria;
        filaSeleccionada.querySelector('.factura__tabla-productos-cantidad').textContent = formatNumber(cantidad);
        filaSeleccionada.querySelector('.factura__tabla-productos-vunit').textContent = formatNumber(precio);
        filaSeleccionada.querySelector('.factura__tabla-productos-descuento').textContent = formatNumber(descuento);
        filaSeleccionada.querySelector('.factura__tabla-productos-subtotal').textContent = formatNumber(subtotal);

        filaSeleccionada.classList.remove('seleccionada'); // Quitar la selección
        filaSeleccionada = null; // Limpiar la variable
    } else {
        // Crear nueva fila
        const nuevaFila = document.createElement('tr');
        nuevaFila.innerHTML = `
            <td class="factura__tabla-productos-codigo">${codigo}</td>
            <td class="factura__tabla-productos-nombre">${nombreProducto}</td>
            <td class="factura__tabla-productos-categoria">${categoria}</td>
            <td class="factura__tabla-productos-cantidad">${formatNumber(cantidad)}</td>
            <td class="factura__tabla-productos-vunit">${formatNumber(precio)}</td>
            <td class="factura__tabla-productos-descuento">${formatNumber(descuento)}</td>
            <td class="factura__tabla-productos-subtotal">${formatNumber(subtotal)}</td>
        `;

        // Agregar evento de selección con un clic
        nuevaFila.addEventListener('click', function () {
            seleccionarProducto(this);
        });

        // Agregar la nueva fila a la tabla
        document.querySelector('#tabla-productos tbody').appendChild(nuevaFila);
    }

    // Actualizar los totales
    actualizarTotales();

    // Limpiar el formulario
    limpiarFormulario();
});

// Función para seleccionar un producto de la tabla
function seleccionarProducto(fila) {
    const codigo = fila.querySelector('.factura__tabla-productos-codigo').textContent.trim();
    const nombreProducto = fila.querySelector('.factura__tabla-productos-nombre').textContent.trim();
    const categoria = fila.querySelector('.factura__tabla-productos-categoria').textContent.trim();
    const cantidad = parseFloat(fila.querySelector('.factura__tabla-productos-cantidad').textContent.replace(/,/g, '')) || 0;
    const precio = parseFloat(fila.querySelector('.factura__tabla-productos-vunit').textContent.replace(/,/g, '')) || 0;

    // Pasar los valores seleccionados a los campos del formulario
    document.getElementById('fCodigo').value = codigo;
    document.getElementById('fNombreProducto').value = nombreProducto;
    document.getElementById('fCategoria').value = categoria;
    document.getElementById('cantidad').value = cantidad;
    document.getElementById('fPrecio').value = precio;

    // Marcar la fila como seleccionada
    if (filaSeleccionada) filaSeleccionada.classList.remove('seleccionada'); // Quitar selección previa
    filaSeleccionada = fila;
    filaSeleccionada.classList.add('seleccionada');
}

// Botón para eliminar producto
document.getElementById('eliminarProducto').addEventListener('click', function (event) {
    // Prevenir que la página se recargue
    event.preventDefault();

    if (filaSeleccionada) {
        // Eliminar la fila seleccionada
        filaSeleccionada.remove();
        // Actualizar los totales después de eliminar el producto
        actualizarTotales();
        filaSeleccionada = null; // Limpiar la selección
    } else {
        alert('Por favor, seleccione un producto para eliminar.');
    }
});

// Limpiar formulario
function limpiarFormulario() {
    document.getElementById('codigo').value = '';
    document.getElementById('nombreProducto').value = '';
    document.getElementById('categoria').value = '';
    document.getElementById('cantidad').value = '';
    document.getElementById('precio').value = '';
    document.getElementById('descuento').value = '';
    document.getElementById('subtotal').value = '';

    if (filaSeleccionada) {
        filaSeleccionada.classList.remove('seleccionada');
        filaSeleccionada = null;
    }
}

// Función para actualizar totales
function actualizarTotales() {
    const filas = document.querySelectorAll('#tabla-productos tbody tr');
    let totalSubtotal = 0;
    let totalDescuento = 0;//n
    

    filas.forEach(fila => {
        const descuento = parseFloat(fila.querySelector('.factura__tabla-productos-descuento').textContent.replace(/,/g, '')) || 0;
        const subtotal = parseFloat(fila.querySelector('.factura__tabla-productos-subtotal').textContent.replace(/,/g, '').replace('$', '')) || 0;
        totalSubtotal += (subtotal + descuento); // Agregar descuento al subtotal total n
        totalDescuento += descuento; // Acumular descuentos n
        // totalSubtotal += subtotal / 1.19;

    });

    const iva = totalSubtotal * 0.19;
    // const totalFactura = totalSubtotal + iva;
    const totalFactura = totalSubtotal - totalDescuento;
    const totalAPagar = totalFactura; //n
    

    document.querySelector('.tablaTotales tr:nth-child(1) td:nth-child(2)').textContent = `$${formatNumber(totalSubtotal)}`;
    // document.querySelector('.tablaTotales tr:nth-child(3) td:nth-child(2)').textContent = `$${formatNumber(iva)}`;
    document.querySelector('.tablaTotales tr:nth-child(7) td:nth-child(2)').textContent = `$${formatNumber(totalFactura)}`;
    document.querySelector('.tablaTotales tr:nth-child(2) td:nth-child(2)').textContent = `$${formatNumber(totalDescuento)}`;
    document.querySelector('.tablaTotales tr.total td:nth-child(2)').textContent = `$${formatNumber(totalAPagar)}`;
}

// Formato de número
function formatNumber(num) {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// FACTURA DE VENTAS (Calcular subtotal automáticamente al cambiar cantidad o precio)
document.getElementById('cantidad').addEventListener('input', calcularSubtotal);
document.getElementById('fPrecio').addEventListener('input', calcularSubtotal);
document.getElementById('descuento').addEventListener('input', calcularSubtotal);

function calcularSubtotal() {
    const cantidad = parseFloat(document.getElementById('cantidad').value.replace(/,/g, '')) || 0;
    const precio = parseFloat(document.getElementById('fPrecio').value.replace(/,/g, '')) || 0;
    const descuento = parseFloat(document.getElementById('descuento').value.replace(/,/g, '')) || 0;

    const subtotal = (cantidad * precio) - descuento;
    document.getElementById('subtotal').value = isNaN(subtotal) ? '' : subtotal.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// Bloquear y desbloquear la vista del password
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const passwordIcon = document.querySelector('.form__icon');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        passwordIcon.src = 'IMG/ver.png'; // Cambia a una imagen de "ojo abierto"
    } else {
        passwordInput.type = 'password';
        passwordIcon.src = 'IMG/ojo-cerrado (1).png'; // Cambia a una imagen de "ojo cerrado"
    }
}

// function togglePassword(event) {
//     // Prevenir el comportamiento predeterminado (por si el botón es de tipo submit)
//     event.preventDefault();

//     // Seleccionar los campos de contraseña
//     const passwordInput = document.getElementById('password');
//     const repeatPasswordInput = document.getElementById('repet_password');
//     const passwordIcon = document.querySelector('.form__icon');

//     // Verificar el estado actual de los campos y alternar entre "password" y "text"
//     const isPassword = passwordInput.type === 'password';

//     passwordInput.type = isPassword ? 'text' : 'password';
//     repeatPasswordInput.type = isPassword ? 'text' : 'password';

//     // Cambiar la imagen del botón según el estado
//     passwordIcon.src = isPassword ? 'IMG/ver.png' : 'IMG/ojo-cerrado (1).png';
// }

// function validatePasswords() {
//     // Seleccionar los campos de contraseña y el mensaje de error
//     const passwordInput = document.querySelector('.form__input--password');
//     const repeatPasswordInput = document.querySelector('.form__input--repet_password');
//     const errorMessage = document.querySelector('.form__error-message'); // Seleccionar el <p> para mostrar el mensaje

//     // Verificar si las contraseñas coinciden
//     if (passwordInput.value !== repeatPasswordInput.value ) {
//         // Si no coinciden, mostrar el mensaje de error y aplicar fondo rojo claro
//         errorMessage.textContent = "La contraseña y su confirmación no coinciden.";
//         errorMessage.style.color = "red"; // Aseguramos que el texto sea visible en rojo
//         repeatPasswordInput.style.backgroundColor = "#ffb6c1"; // Fondo rojo claro
//     } else {
//         // Si coinciden, limpiar el mensaje de error y restablecer el estilo
//         errorMessage.textContent = ""; // Vaciar el mensaje
//         repeatPasswordInput.style.backgroundColor = ""; // Restablecer el fondo
//     }
// }




