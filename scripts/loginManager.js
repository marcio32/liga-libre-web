function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (isLoginValid(username, password)) {
        window.location.href = "index.html";
    } else {
        alert("Credenciales incorrectas");
    }
}

function isLoginValid(username, password) {
    // Harcodeamos este if hasta que lo integremos con la API
    return username === "user" && password === "123";
}