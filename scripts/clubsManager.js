function getAuthHeaders() {
 const token = localStorage.getItem('token');
 return {
     'Content-Type': 'application/json',
     'Authorization': `Bearer ${token}`
 }
}

async function loadClubs() {
    // /{ruta del recurso}
    const response = await fetch(`${API_BASE_URL}/Club/GetAll`, {
        headers: getAuthHeaders()
    });

    const responseContent = await response.json();

    renderClubs(responseContent);
}

function renderClubs(clubs) {
    const tbody = document.querySelector('#clubsTable tbody')
    const isAdmin = checkIsAdmin();


    clubs.forEach(club => {
        const adminActions = isAdmin ? `<a class="btn btn-primary" href="#" onclick="editClub()">Editar</a> <a class="btn btn-danger" href="#" onclick="deleteClub()">Eliminar</a>` : '';

        const row = document.createElement('tr');
        row.innerHTML = `<td>${club.id}</td>
                         <td>${club.name}</td>
                         <td>${club.city}</td>
                         <td>${club.email}</td>
                         <td>${club.numberOfPartners}</td>
                         <td>${club.phone}</td>
                         <td>${club.address}</td>
                         <td>${club.stadiumName}</td>
                         <td>
                            <a class="btn btn-secondary" href="www.google.com">ver</a>
                            ${adminActions} 
                         </td>
                        `;
        tbody.appendChild(row);
    });
}

function checkIsAdmin(){
    const roles = JSON.parse(localStorage.getItem('userRoles'));
    return roles.includes('Admin');
}

function showCreateForm(){
    const main = document.querySelector('.main-content');

    main.innerHTML = `
    <h2>Crear Club</h2>
    <form id="clubForm">
    <div style="width:15%">
     <input class="form-control" type="text" id="name" name="name" placeholder="Nombre" required><br>
        <input class="form-control" type="text" id="city" name="city" placeholder="Ciudad" required><br>
        <input class="form-control" type="email" id="email" name="email" placeholder="Email" required><br>
        <input class="form-control" type="number" id="numberOfPartners" name="numberOfPartners" placeholder="Número de socios" required><br>
        <input class="form-control" type="text" id="phone" name="phone" placeholder="Teléfono" required><br>
        <input class="form-control" type="text" id="address" name="address" placeholder="Dirección" required><br>
        <input class="form-control" type="text" id="stadiumName" name="stadiumName" placeholder="Nombre del estadio" required><br>
        <button class="btn btn-primary mt-3" type="button" onclick="createClub()">Crear</button>
        <button class="btn btn-danger mt-3" type="button" onclick="location.reload()">Cancelar</button>
    </div>
       
    </form>`
}

function createClub(){
    const clubData = {
        name: document.getElementById('name').value,
        city: document.getElementById('city').value,
        email: document.getElementById('email').value,
        numberOfPartners: document.getElementById('numberOfPartners').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        stadiumName: document.getElementById('stadiumName').value
    };

    fetch(`${API_BASE_URL}/Club/Create`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(clubData)
    }).then(response => {
        if(response.ok){
            alert('Club creado con éxito');
            location.reload();
        }else{
            alert('Error al crear el club');
        }
    })
}

window.onload = () => loadClubs();