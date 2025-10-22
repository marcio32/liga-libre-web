function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
}

async function loadReferees() {
    const response = await fetch(`${API_BASE_URL}/Referee/GetAllReferees`, {
        headers: getAuthHeaders()
    });
    const responseContent = await response.json();
    renderReferees(responseContent);
}

function renderReferees(referees) {
    const isAdmin = checkIsAdmin();
    const data = referees.map(referee => [
        referee.id,
        referee.firstName,
        referee.lastName,
        referee.licenseNumber,
        referee.category,
        referee.isActive ? 'Activo' : 'Inactivo',
        isAdmin ? `<button class="btn btn-sm btn-primary me-2" onclick="editReferee(${referee.id})">Editar</button>
                 <button class="btn btn-sm btn-danger" onclick="deleteReferee(${referee.id})">Eliminar</button>` : 'No autorizado'
    ]);

    $('#refereesTable').DataTable({
        data: data,
        language: {
            url: 'https://cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json'
        }
    });
}

function checkIsAdmin() {
    const roles = JSON.parse(localStorage.getItem('userRoles'));
    return roles.includes('Admin');
}

async function showCreateForm() {
    const main = document.querySelector('.main-content');
    main.innerHTML = `
    <div class="container mt-4">
        <h2 class="mb-4">Crear Árbitro</h2>
        <form id="refereeForm" class="needs-validation" novalidate>
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
                        <label for="licenseNumber" class="form-label">Número de Licencia</label>
                        <input class="form-control" type="text" id="licenseNumber" name="licenseNumber" required>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="category" class="form-label">Categoría</label>
                        <select class="form-control" id="category" name="category" required>
                            <option value="0">Nacional</option>
                            <option value="1">Internacional</option>
                            <option value="2">Regional</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="isActive" class="form-label">Estado</label>
                        <select class="form-control" id="isActive" name="isActive" required>
                            <option value="true">Activo</option>
                            <option value="false">Inactivo</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="d-flex gap-2 mt-4">
                <button class="btn btn-primary" type="button" onclick="createReferee()">Crear</button>
                <button class="btn btn-secondary" type="button" onclick="location.reload()">Cancelar</button>
            </div>
        </form>
    </div>`;
}

async function editReferee(id) {
    const response = await fetch(`${API_BASE_URL}/Referee/GetRefereesById?id=${id}`, {
        headers: getAuthHeaders()
    });
    const referee = await response.json();
    
    const main = document.querySelector('.main-content');
    main.innerHTML = `
    <div class="container mt-4">
        <h2 class="mb-4">Editar Árbitro</h2>
        <form id="refereeForm" class="needs-validation" novalidate>
            <div class="row">
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="firstName" class="form-label">Nombre</label>
                        <input class="form-control" type="text" id="firstName" name="firstName" value="${referee.firstName || ''}" required>
                    </div>
                    <div class="mb-3">
                        <label for="lastName" class="form-label">Apellido</label>
                        <input class="form-control" type="text" id="lastName" name="lastName" value="${referee.lastName || ''}" required>
                    </div>
                    <div class="mb-3">
                        <label for="licenseNumber" class="form-label">Número de Licencia</label>
                        <input class="form-control" type="text" id="licenseNumber" name="licenseNumber" value="${referee.licenseNumber || ''}" required>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="category" class="form-label">Categoría</label>
                        <select class="form-control" id="category" name="category" required>
                            <option value="0" ${referee.category === 0 ? 'selected' : ''}>Nacional</option>
                            <option value="1" ${referee.category === 1 ? 'selected' : ''}>Internacional</option>
                            <option value="2" ${referee.category === 2 ? 'selected' : ''}>Regional</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="isActive" class="form-label">Estado</label>
                        <select class="form-control" id="isActive" name="isActive" required>
                            <option value="true" ${referee.isActive ? 'selected' : ''}>Activo</option>
                            <option value="false" ${!referee.isActive ? 'selected' : ''}>Inactivo</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="d-flex gap-2 mt-4">
                <button class="btn btn-primary" type="button" onclick="updateReferee(${id})">Actualizar</button>
                <button class="btn btn-secondary" type="button" onclick="location.reload()">Cancelar</button>
            </div>
        </form>
    </div>`;
}

function createReferee() {
    const refereeData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        licenseNumber: document.getElementById('licenseNumber').value,
        category: parseInt(document.getElementById('category').value),
        isActive: document.getElementById('isActive').value === 'true'
    };

    fetch(`${API_BASE_URL}/Referee/CreateReferee`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(refereeData)
    }).then(response => {
        if (response.ok) {
            Swal.fire({
                title: "Creado!",
                text: "Árbitro creado con éxito",
                icon: "success"
            });
            location.reload();
        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Error al crear el árbitro"
            });
        }
    });
}

function updateReferee(id) {
    const refereeData = {
        id: id,
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        licenseNumber: document.getElementById('licenseNumber').value,
        category: parseInt(document.getElementById('category').value),
        isActive: document.getElementById('isActive').value === 'true'
    };

    fetch(`${API_BASE_URL}/Referee/UpdateReferee`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(refereeData)
    }).then(response => {
        if (response.ok) {
            Swal.fire({
                title: "Actualizado!",
                text: "Árbitro actualizado con éxito",
                icon: "success"
            });
            location.reload();
        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Error al actualizar el árbitro"
            });
        }
    });
}

function deleteReferee(id) {
    Swal.fire({
        title: "¿Estás Seguro?",
        text: "Vas a eliminar el árbitro seleccionado!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Eliminar!",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`${API_BASE_URL}/Referee/DeleteReferee?id=${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            }).then(response => {
                if (response.ok) {
                    Swal.fire({
                        title: "Eliminado!",
                        text: "El árbitro ha sido eliminado.",
                        icon: "success"
                    });
                    location.reload();
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "No se pudo eliminar el árbitro"
                    });
                }
            });
        }
    });
}

window.onload = () => loadReferees();
