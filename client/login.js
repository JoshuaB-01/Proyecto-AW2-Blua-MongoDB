const formLogIn = document.getElementById("logInForm");
const error = document.getElementById("error");

formLogIn.addEventListener('submit', (e) => {
    e.preventDefault();
    logIn();
});

const logIn = async () => {
    try {
        error.textContent = "";
        const email = document.getElementById("email").value;
        const contraseña = document.getElementById("contraseña").value;

        const res = await fetch('http://localhost:3001/users/login', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, contraseña })
        });

        const data = await res.json();
        console.log('Respuesta del login:', data);

        if (res.ok && data.status) {
            if (!data.token) {
                throw new Error('No se recibió el token del servidor');
            }

            localStorage.setItem('token', data.token);
            sessionStorage.setItem('user', JSON.stringify(data.user));
            
            const savedToken = localStorage.getItem('token');
            console.log('Token guardado:', savedToken);
            
            window.location.href = "pages/home.html";
        } else {
            error.textContent = data.error || "Error al iniciar sesión";
        }
    } catch (error) {
        console.error('Error:', error);
        error.textContent = "Error en la conexión. Por favor, intente más tarde.";
    }
};