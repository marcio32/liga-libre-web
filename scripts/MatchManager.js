async function loadMatches() {
    const response = await fetch(`${CONFIG.API_BASE_URL}/Match/GetAllMatches`, {
        headers: CONFIG.getAuthHeaders()
    });
    const responseContent = await response.json();
    renderMatches(responseContent);
}

function renderMatches(matches) {
    const isAdmin = checkIsAdmin();
    debugger
    const data = matches.map(match => {
        
        const statusText = getStatusText(match.status);

        return [
            match.id,
            match.homeClubName,
            match.awayClubName,
            match.result,
            match.round,
            new Date(match.matchDate).toLocaleDateString('es-ES'),
            `<span class="badge bg-${getStatusColor(match.status)}">${statusText}</span>`,
            isAdmin ? `<button class="btn btn-sm btn-primary me-2" onclick="editMatch(${match.id})">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteMatch(${match.id})">Eliminar</button>` : 'No autorizado'
        ];
});

    $('#matchesTable').DataTable({
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
    const clubs = await loadClubs();
    const clubOptions = clubs.map(club => `<option value="${club.id}">${club.name}</option>`).join('');
    const main = document.querySelector('.main-content');
    main.innerHTML = `
    <div class="container mt-4">
        <h2 class="mb-4">Crear Partido</h2>
        <form id="matchForm" class="needs-validation" novalidate>
            <div class="row">
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="homeClubId" class="form-label">Club Local</label>
                        <select class="form-control" id="homeClubId" name="homeClubId" required>
                            <option value="" disabled selected>Selecciona un club</option>
                            ${clubOptions}
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="awayClubId" class="form-label">Club Visitante</label>
                        <select class="form-control" id="awayClubId" name="awayClubId" required>
                            <option value="" disabled selected>Selecciona un club</option>
                            ${clubOptions}
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="round" class="form-label">Jornada</label>
                        <input class="form-control" type="number" id="round" name="round" required>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="matchDate" class="form-label">Fecha del Partido</label>
                        <input class="form-control" type="datetime-local" id="matchDate" name="matchDate" required>
                    </div>
                    <div class="mb-3">
                        <label for="stadium" class="form-label">Estadio</label>
                        <input class="form-control" type="number" id="stadium" name="stadium" required>
                    </div>
                    <div class="mb-3">
                        <label for="notes" class="form-label">Notas</label>
                        <textarea class="form-control" id="notes" name="notes"></textarea>
                    </div>
                </div>
            </div>
            <div class="d-flex gap-2 mt-4">
                <button class="btn btn-primary" type="button" onclick="createMatch()">Crear</button>
                <button class="btn btn-secondary" type="button" onclick="location.reload()">Cancelar</button>
            </div>
        </form>
    </div>`;
}

async function editMatch(id) {
    const response = await fetch(`${CONFIG.API_BASE_URL}/Match/GetMatchById?id=${id}`, {
        headers: CONFIG.getAuthHeaders()
    });
    const match = await response.json();
    const clubs = await loadClubs();
    const clubOptions = clubs.map(club => `<option value="${club.id}">${club.name}</option>`).join('');
    
    const main = document.querySelector('.main-content');
    main.innerHTML = `
    <div class="container mt-4">
        <h2 class="mb-4">Editar Partido</h2>
        <form id="matchForm" class="needs-validation" novalidate>
            <div class="row">
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="homeClubId" class="form-label">Club Local</label>
                        <select class="form-control" id="homeClubId" name="homeClubId" required>
                            ${clubs.map(club => `<option value="${club.id}" ${club.id === match.homeClubId ? 'selected' : ''}>${club.name}</option>`).join('')}
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="awayClubId" class="form-label">Club Visitante</label>
                        <select class="form-control" id="awayClubId" name="awayClubId" required>
                            ${clubs.map(club => `<option value="${club.id}" ${club.id === match.awayClubId ? 'selected' : ''}>${club.name}</option>`).join('')}
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="homeScore" class="form-label">Goles Local</label>
                        <input class="form-control" type="number" id="homeScore" name="homeScore" value="${match.homeScore || 0}" required>
                    </div>
                    <div class="mb-3">
                        <label for="awayScore" class="form-label">Goles Visitante</label>
                        <input class="form-control" type="number" id="awayScore" name="awayScore" value="${match.awayScore || 0}" required>
                    </div>
                    <div class="mb-3">
                        <label for="round" class="form-label">Jornada</label>
                        <input class="form-control" type="number" id="round" name="round" value="${match.round}" required>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="matchDate" class="form-label">Fecha del Partido</label>
                        <input class="form-control" type="datetime-local" id="matchDate" name="matchDate" value="${match.matchDate ? match.matchDate.substring(0, 16) : ''}" required>
                    </div>
                    <div class="mb-3">
                        <label for="stadium" class="form-label">Estadio</label>
                        <input class="form-control" type="number" id="stadium" name="stadium" value="${match.stadium}" required>
                    </div>
                    <div class="mb-3">
                        <label for="status" class="form-label">Estado</label>
                        <select class="form-control" id="status" name="status" required>
                            <option value="0" ${match.status === 0 ? 'selected' : ''}>Programado</option>
                            <option value="1" ${match.status === 1 ? 'selected' : ''}>En Curso</option>
                            <option value="2" ${match.status === 2 ? 'selected' : ''}>Finalizado</option>
                            <option value="3" ${match.status === 3 ? 'selected' : ''}>Cancelado</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="notes" class="form-label">Notas</label>
                        <textarea class="form-control" id="notes" name="notes">${match.notes || ''}</textarea>
                    </div>
                </div>
            </div>
            <div class="d-flex gap-2 mt-4">
                <button class="btn btn-primary" type="button" onclick="updateMatch(${id})">Actualizar</button>
                <button class="btn btn-secondary" type="button" onclick="location.reload()">Cancelar</button>
            </div>
        </form>
    </div>`;
}

function createMatch() {
    
    const form = document.getElementById('matchForm');

    if(!form.checkValidity()){
        Swal.fire({
            icon: "warning",
            title: "Oops...",
            text: "Por favor, completa todos los campos correctamente"
        });
        return;
    }

    const matchData = {
        homeClubId: parseInt(document.getElementById('homeClubId').value),
        awayClubId: parseInt(document.getElementById('awayClubId').value),
        round: parseInt(document.getElementById('round').value),
        matchDate: document.getElementById('matchDate').value,
        stadium: parseInt(document.getElementById('stadium').value),
        notes: document.getElementById('notes').value
    };

    fetch(`${CONFIG.API_BASE_URL}/Match/CreateMatch`, {
        method: 'POST',
        headers: CONFIG.getAuthHeaders(),
        body: JSON.stringify(matchData)
    }).then(response => {
        if (response.ok) {
            Swal.fire({
                title: "Creado!",
                text: "Partido creado con éxito",
                icon: "success"
            });
            location.reload();
        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Error al crear el partido"
            });
        }
    });
}

function updateMatch(id) {

    const form = document.getElementById('matchForm');

    if(!form.checkValidity()){
        Swal.fire({
            icon: "warning",
            title: "Oops...",
            text: "Por favor, completa todos los campos correctamente"
        });
        return;
    }

    const matchData = {
        id: id,
        homeClubId: parseInt(document.getElementById('homeClubId').value),
        awayClubId: parseInt(document.getElementById('awayClubId').value),
        homeScore: parseInt(document.getElementById('homeScore').value),
        awayScore: parseInt(document.getElementById('awayScore').value),
        round: parseInt(document.getElementById('round').value),
        matchDate: document.getElementById('matchDate').value,
        stadium: parseInt(document.getElementById('stadium').value),
        status: parseInt(document.getElementById('status').value),
        notes: document.getElementById('notes').value
    };

    fetch(`${CONFIG.API_BASE_URL}/Match/UpdateMatch`, {
        method: 'PUT',
        headers: CONFIG.getAuthHeaders(),
        body: JSON.stringify(matchData)
    }).then(response => {
        if (response.ok) {
            Swal.fire({
                title: "Actualizado!",
                text: "Partido actualizado con éxito",
                icon: "success"
            });
            location.reload();
        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Error al actualizar el partido"
            });
        }
    });
}

function deleteMatch(id) {
    Swal.fire({
        title: "¿Estás Seguro?",
        text: "Vas a eliminar el partido seleccionado!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Eliminar!",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`${CONFIG.API_BASE_URL}/Match/DeleteMatch?id=${id}`, {
                method: 'DELETE',
                headers: CONFIG.getAuthHeaders()
            }).then(response => {
                if (response.ok) {
                    Swal.fire({
                        title: "Eliminado!",
                        text: "El partido ha sido eliminado.",
                        icon: "success"
                    });
                    location.reload();
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "No se pudo eliminar el partido"
                    });
                }
            });
        }
    });
}

async function loadClubs() {
    const response = await fetch(`${API_BASE_URL}/Club/GetAll`, {
        headers: CONFIG.getAuthHeaders()
    });
    return await response.json();
}

function getStatusText(status) {
    const statusMap = {
        0: "Programado",
        1: "En Progreso",
        2: "Finalizado",
        3: "Pospuesto",
        4: "Cancelado"
    };
    return statusMap[status] || "Desconocido";
}

function getStatusColor(status) {
    const colorMap = {
        0: "primary",
        1: "warning",
        2: "success",
        3: "secondary",
        4: "danger"
    };
    return colorMap[status] || "secondary";
}

window.onload = () => loadMatches();
