
document.addEventListener('DOMContentLoaded', () => {
    // ==================== Mostrar/Ocultar Contraseñas ====================
    document.querySelectorAll('.form__icon-registro').forEach(icon => {
        icon.addEventListener('click', () => {
            // Encuentra el input asociado al ícono
            const inputField = icon.previousElementSibling;

            if (inputField.type === 'password') {
                inputField.type = 'text'; // Muestra la contraseña
                icon.src = 'IMG/ver.png'; // Cambia al icono de ojo abierto
                icon.alt = 'Ocultar contraseña';
            } else {
                inputField.type = 'password'; // Oculta la contraseña
                icon.src = 'IMG/ojo-cerrado (1).png'; // Cambia al icono de ojo cerrado
                icon.alt = 'Ver contraseña';
            }
        });
    });

    // ==================== Alternar Formularios (Login/Registro) ====================
    const loginForm = document.querySelector('.login'); // Formulario de login
    const registroForm = document.querySelector('.registro'); // Formulario de registro
    const linkToRegistro = document.querySelector('.login__link'); // Enlace para ir al registro
    const linkToLogin = document.querySelector('.registro__link'); // Enlace para ir al login

    if (loginForm && registroForm) {
        // Ocultar formulario de registro al iniciar
        registroForm.style.display = 'none';

        // Mostrar formulario de registro y ocultar login
        linkToRegistro?.addEventListener('click', (event) => {
            event.preventDefault();
            loginForm.style.display = 'none';
            registroForm.style.display = 'flex';
        });

        // Mostrar formulario de login y ocultar registro
        linkToLogin?.addEventListener('click', (event) => {
            event.preventDefault();
            registroForm.style.display = 'none';
            loginForm.style.display = 'flex';
        });
    }

    // ==================== Validación de Contraseñas ====================
    const passwordInput = document.querySelector('.registro__input--password');
    const repeatPasswordInput = document.querySelector('.registro__input--repet-password');
    const submitButton = document.querySelector('.registro__button');

    function verifyPasswords() {
        const password = passwordInput?.value;
        const repeatPassword = repeatPasswordInput?.value;

        if (password !== repeatPassword || !password || !repeatPassword) {
            submitButton.disabled = true;
            submitButton.style.backgroundColor = 'red'; // Cambiar color a rojo
            submitButton.textContent = 'Contraseña y confirmación no coinciden'; // Cambiar texto
            submitButton.style.fontSize = '12px'; // Cambiar tamaño de fuente
            submitButton.style.color = 'white';
        } else {
            submitButton.disabled = false;
            submitButton.style.backgroundColor = ''; // Restaurar color original
            submitButton.textContent = 'Registrate'; // Restaurar texto original
            submitButton.style.fontSize = ''; // Restaurar tamaño de fuente original
            submitButton.style.color = '';
        }
    }

    passwordInput?.addEventListener('input', verifyPasswords);
    repeatPasswordInput?.addEventListener('input', verifyPasswords);

    // ==================== Validación de Campos Vacíos ====================
    const inputs = document.querySelectorAll('.registro__input');

    function verifyFields() {
        const allFieldsFilled = Array.from(inputs).every(input => input.value.trim() !== '');

        if (!allFieldsFilled) {
            submitButton.disabled = true;
            submitButton.style.backgroundColor = 'orange'; // Cambiar color a gris
            submitButton.textContent = 'Todos los campos son obligatorios'; // Cambiar texto
            submitButton.style.fontSize = '13px'; // Cambiar tamaño de fuente
            submitButton.style.color = 'white';
        } else {
            verifyPasswords(); // Verificar contraseñas si todos los campos están llenos
        }
    }

    inputs.forEach(input => {
        input.addEventListener('input', verifyFields);
    });

    // Ejecutar la validación al cargar la página
    verifyFields();
});

