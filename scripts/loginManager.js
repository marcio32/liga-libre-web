const API_BASE_URL = "https://localhost:7007/api";

async function login() {
    const email = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if(!email || !password) {
        alert("Por favor, complete todos los campos.");
        return;
    }

    try
    {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body : JSON.stringify({email, password}) }
    );

    if(response.ok){
        const data = await response.json();
            localStorage.setItem('token', data.token);
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

function logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRoles');
    window.location.href = 'login.html';
}
