async function loadPlayers() {
    const response = await fetch(`${CONFIG.API_BASE_URL}/Players/GetAllPlayers`, {
        headers: CONFIG.getAuthHeaders()
    });
    const responseContent = await response.json();

    renderPlayers(responseContent);
}

function renderPlayers(players) {
    const isAdmin = checkIsAdmin();
    const data = players.map(player => [
        player.id,
        player.firstName,
        player.lastName,
        player.position,
        player.age,
        player.jerseyNumber,
        player.clubId,
        player.goals,
        player.assists,
        isAdmin ? `<button class="btn btn-sm btn-primary me-2" onclick="editPlayer(${player.id})">Editar</button>
                 <button class="btn btn-sm btn-danger" onclick="deletePlayer(${player.id})">Eliminar</button>` : 'No autorizado'
    ]);

  $('#playersTable').DataTable({
    data: data,
    language: {
        url: 'https://cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json'
        }
  })

}

function checkIsAdmin(){
    const roles = JSON.parse(localStorage.getItem('userRoles'));
    return roles.includes('Admin');
}

async function showCreateForm(){
    const clubs = await loadClubs();
    const clubOptions = clubs.map(club => `<option value="${club.id}">${club.name}</option>`).join('');
    const main = document.querySelector('.main-content');
    main.innerHTML = `
    <div class="container mt-4">
        <h2 class="mb-4">Crear Jugador</h2>
        <form id="playerForm" class="needs-validation" novalidate>
            <div class="row">
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="firstName" class="form-label">Nombre</label>
                        <input class="form-control" type="text" id="firstName" name="firstName" required>
                    </div>
                    <div class="mb-3">
                        <label for="lastName" class="form-label">Apellido</label>
                        <input class="form-control" type="text" id="lastName" name="lastName" required>
                    </div>
                    <div class="mb-3">
                        <label for="position" class="form-label">Posición</label>
                        <input class="form-control" type="text" id="position" name="position" required>
                    </div>
                    <div class="mb-3">
                        <label for="age" class="form-label">Edad</label>
                        <input class="form-control" type="number" id="age" name="age" required>
                    </div>
                    <div class="mb-3">
                        <label for="jerseyNumber" class="form-label">Número de Camiseta</label>
                        <input class="form-control" type="number" id="jerseyNumber" name="jerseyNumber" required>
                    </div>
                    <div class="mb-3">
                        <label for="nationality" class="form-label">Nacionalidad</label>
                        <input class="form-control" type="text" id="nationality" name="nationality" required>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="height" class="form-label">Altura (m)</label>
                        <input class="form-control" type="number" step="0.01" id="height" name="height" required>
                    </div>
                    <div class="mb-3">
                        <label for="weight" class="form-label">Peso (kg)</label>
                        <input class="form-control" type="number" id="weight" name="weight" required>
                    </div>
                    <div class="mb-3">
                        <label for="dateOfBirth" class="form-label">Fecha de Nacimiento</label>
                        <input class="form-control" type="date" id="dateOfBirth" name="dateOfBirth" required>
                    </div>
                    <div class="mb-3">
                        <label for="joinedClubDate" class="form-label">Fecha de Ingreso al Club</label>
                        <input class="form-control" type="date" id="joinedClubDate" name="joinedClubDate" required>
                    </div>
                    <div class="mb-3">
                        <label for="clubId" class="form-label">Club</label>
                        <select class="form-control" id="clubId" name="clubId" required>
                            <option value="" disabled selected>Selecciona un club</option>
                            ${clubOptions}
                        </select>
                    </div>
                </div>
            </div>
            <div class="d-flex gap-2 mt-4">
                <button class="btn btn-primary" type="button" onclick="createPlayer()">Crear</button>
                <button class="btn btn-secondary" type="button" onclick="location.reload()">Cancelar</button>
            </div>
        </form>
    </div>`
}

async function editPlayer(id){
    debugger
    const response = await fetch(`${CONFIG.API_BASE_URL}/Players/GetPlayerById?id=${id}`, {
        headers: CONFIG.getAuthHeaders()
    });
    const player = await response.json();
    const clubs = await loadClubs();
    const clubOptions = clubs.map(club => 
        `<option value="${club.id}" ${club.id === player.clubId ? 'selected' : ''}>${club.name}</option>`
    ).join('');
    
    const main = document.querySelector('.main-content');
    main.innerHTML = `
    <div class="container mt-4">
        <h2 class="mb-4">Editar Jugador</h2>
        <form id="playerForm" class="needs-validation" novalidate>
            <div class="row">
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="firstName" class="form-label">Nombre</label>
                        <input class="form-control" type="text" id="firstName" name="firstName" value="${player.firstName || ''}" required>
                    </div>
                    <div class="mb-3">
                        <label for="lastName" class="form-label">Apellido</label>
                        <input class="form-control" type="text" id="lastName" name="lastName" value="${player.lastName || ''}" required>
                    </div>
                    <div class="mb-3">
                        <label for="position" class="form-label">Posición</label>
                        <input class="form-control" type="text" id="position" name="position" value="${player.position || ''}" required>
                    </div>
                    <div class="mb-3">
                        <label for="age" class="form-label">Edad</label>
                        <input class="form-control" type="number" id="age" name="age" value="${player.age || ''}" required>
                    </div>
                    <div class="mb-3">
                        <label for="jerseyNumber" class="form-label">Número de Camiseta</label>
                        <input class="form-control" type="number" id="jerseyNumber" name="jerseyNumber" value="${player.jerseyNumber || ''}" required>
                    </div>
                    <div class="mb-3">
                        <label for="nationality" class="form-label">Nacionalidad</label>
                        <input class="form-control" type="text" id="nationality" name="nationality" value="${player.nationality || ''}" required>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="height" class="form-label">Altura (m)</label>
                        <input class="form-control" type="number" step="0.01" id="height" name="height" value="${player.height || ''}" required>
                    </div>
                    <div class="mb-3">
                        <label for="weight" class="form-label">Peso (kg)</label>
                        <input class="form-control" type="number" id="weight" name="weight" value="${player.weight || ''}" required>
                    </div>
                    <div class="mb-3">
                        <label for="dateOfBirth" class="form-label">Fecha de Nacimiento</label>
                        <input class="form-control" type="date" id="dateOfBirth" name="dateOfBirth" value="${player.dateOfBirth ? player.dateOfBirth.split('T')[0] : ''}" required>
                    </div>
                    <div class="mb-3">
                        <label for="joinedClubDate" class="form-label">Fecha de Ingreso al Club</label>
                        <input class="form-control" type="date" id="joinedClubDate" name="joinedClubDate" value="${player.joinedClubDate ? player.joinedClubDate.split('T')[0] : ''}" required>
                    </div>
                    <div class="mb-3">
                        <label for="clubId" class="form-label">Club</label>
                        <select class="form-control" id="clubId" name="clubId" required>
                            <option value="" disabled>Selecciona un club</option>
                            ${clubOptions}
                        </select>
                    </div>
                </div>
            </div>
            <div class="d-flex gap-2 mt-4">
                <button class="btn btn-primary" type="button" onclick="updatePlayer(${id})">Actualizar</button>
                <button class="btn btn-secondary" type="button" onclick="location.reload()">Cancelar</button>
            </div>
        </form>
    </div>`
}

function createPlayer(){

    const form = document.getElementById('playerForm');

    if(!form.checkValidity()){
        Swal.fire({
            icon: "warning",
            title: "Oops...",
            text: "Por favor, completa todos los campos correctamente"
        });
        return;
    }

    const playerData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        position: document.getElementById('position').value,
        age: parseInt(document.getElementById('age').value),
        jerseyNumber: parseInt(document.getElementById('jerseyNumber').value),
        nationality: document.getElementById('nationality').value,
        height: parseFloat(document.getElementById('height').value),
        weight: parseFloat(document.getElementById('weight').value),
        dateOfBirth: document.getElementById('dateOfBirth').value,
        joinedClubDate: document.getElementById('joinedClubDate').value,
        clubId: parseInt(document.getElementById('clubId').value)
    };

    fetch(`${CONFIG.API_BASE_URL}/Players/CreatePlayer`, {
        method: 'POST',
        headers: CONFIG.getAuthHeaders(),
        body: JSON.stringify(playerData)
    }).then(response => {
        if(response.ok){
              Swal.fire({
                    title: "Creado!",
                    text: "Player creado con éxito",
                    icon: "success"});
            location.reload();
        }else{
             Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Error al crear el player",
                    });
        }
    })
}

function updatePlayer(id){

    const form = document.getElementById('playerForm');

    if(!form.checkValidity()){
        Swal.fire({
            icon: "warning",
            title: "Oops...",
            text: "Por favor, completa todos los campos correctamente"
        });
        return;
    }

    const playerData = {
        id:id,
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        position: document.getElementById('position').value,
        age: parseInt(document.getElementById('age').value),
        jerseyNumber: parseInt(document.getElementById('jerseyNumber').value),
        nationality: document.getElementById('nationality').value,
        height: parseFloat(document.getElementById('height').value),
        weight: parseFloat(document.getElementById('weight').value),
        dateOfBirth: document.getElementById('dateOfBirth').value,
        joinedClubDate: document.getElementById('joinedClubDate').value,
        clubId: parseInt(document.getElementById('clubId').value)
    };

    fetch(`${API_BASE_URL}/Players/UpdatePlayer`, {
        method: 'Put',
        headers: CONFIG.getAuthHeaders(),
        body: JSON.stringify(playerData)
    }).then(response => {
        if(response.ok){
             Swal.fire({
                    title: "Actualizado!",
                    text: "Player actualizado con éxito",
                    icon: "success"});
            location.reload();
        }else{
             Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Error al crear el player",
                    });
        }
    })
}

function deletePlayer(id){
    Swal.fire({
        title: "Estas Seguro?",
        text: "Vas a eliminar el player seleccionado!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Eliminar!",
        cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) { 
            fetch(`${CONFIG.API_BASE_URL}/Players/DeletePlayer?id=${id}`, {
                method: 'DELETE',
                headers: CONFIG.getAuthHeaders()
            }).then(response => {
                if(response.ok){
                    Swal.fire({
                    title: "Eliminado!",
                    text: "El player ha sido eliminado.",
                    icon: "success"
                });
                location.reload();
                }else{
                    Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "No se pudo eliminar el player",
                    });
                }
            })
            
        }
    });
}

async function loadClubs() {
    const response = await fetch(`${CONFIG.API_BASE_URL}/Club/GetAll`, {
        headers: CONFIG.getAuthHeaders()
    });
    return await response.json();
}
 

window.onload = () => loadPlayers();