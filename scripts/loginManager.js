async function login() {
    const email = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if(!email || !password) {
        alert("Por favor, complete todos los campos.");
        return;
    }

    try
    {
        const response = await fetch(`${CONFIG.API_BASE_URL}/auth/login`, {
            method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body : JSON.stringify({email, password}) }
    );

    if(response.ok){
        const data = await response.json();
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userEmail', data.email);
            localStorage.setItem('userRoles', JSON.stringify(data.roles));
            window.location.href = 'index.html';
    }else{
        const error = await response.json();
        alert('error:', error)
    }

    }
    catch(error){
        console.error('Error', error);
        alert('Error de conexion. Intente nuevamente mas tarde.');
    }

}

function showRegisterForm(){
    const containerLogin = document.querySelector('.login-container');
    containerLogin.innerHTML = `
        <h2>Registrarse</h2>
        <div class="form-group">
            <label class="form-label">Nombre</label>
            <input class="form-control forms-login" type="text" id="firstName" placeholder="Ingrese su nombre" required>
        </div>
        <div class="form-group">
            <label class="form-label">Apellido</label>
            <input class="form-control forms-login" type="text" id="lastName" placeholder="Ingrese su apellido" required>
        </div>
        <div class="form-group">
            <label class="form-label"">Email</label>
            <input class="form-control forms-login" type="email" id="registerEmail" placeholder="Ingrese su email" required>
        </div>
        <div class="form-group">
            <label class="form-label"">Contraseña</label>
            <input class="form-control forms-login" type="password" id="registerPassword" placeholder="Ingrese su Contraseña" required>
        </div>
        <button type="button" class="btn-login" onclick="register()">Registrarse</button>
        <div class="footer">
            ¿Ya tenés cuenta? <a href="#" onclick="showLoginForm()">Iniciar Sesión</a>
        </div>
    `
}

async function register(){
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    if(!firstName || !lastName || !email || !password){
        Swal.fire("Por favor, complete todos los campos.");
        return;
    }
    debugger
    const response = await fetch(`${CONFIG.API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({firstName, lastName, email, password})
    })

    if(response.ok){
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('userEmail', data.email);
        localStorage.setItem('userName', `${data.firstName} ${data.lastName}`);
        localStorage.setItem('userRoles', JSON.stringify(data.roles));
        window.location.href = 'index.html';
    }else{
        const error = await response.json();
        Swal.fire('Error:', error.message);
    }
}

function showLoginForm(){
    location.reload();
}

function logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRoles');
    window.location.href = 'login.html';
}
