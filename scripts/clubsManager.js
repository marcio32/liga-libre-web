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
    const isAdmin = checkIsAdmin();
    
    const data = clubs.map(club => [
        club.id,
        club.name,
        club.city,
        club.email,
        club.numberOfPartners,
        club.phone,
        club.address,
        club.stadiumName,
        isAdmin ? `<button class="btn btn-warning btn-sm" onclick="editClub(${club.id})">Editar</button>
                  <button class="btn btn-danger btn-sm" onclick="deleteClub(${club.id})">Eliminar</button>` : 'No autorizado'

        ]);

    $('#clubsTable').DataTable({
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

function editClub(id){
    fetch(`${API_BASE_URL}/Club/GetById?id=${id}`, {
        headers: getAuthHeaders()
    }).then(response => response.json()).then(
        club => {
            debugger
            const main = document.querySelector('.main-content');

            main.innerHTML = `
            <h2>Crear Club</h2>
            <form id="clubForm">
            <div style="width:15%">
                <input class="form-control" type="text" id="name" name="name" placeholder="Nombre" value="${club.name}" required><br>
                <input class="form-control" type="text" id="city" name="city" placeholder="Ciudad" value="${club.city}" required><br>
                <input class="form-control" type="email" id="email" name="email" placeholder="Email" value="${club.email}" required><br>
                <input class="form-control" type="number" id="numberOfPartners" name="numberOfPartners" placeholder="Número de socios" value="${club.numberOfPartners}" required><br>
                <input class="form-control" type="text" id="phone" name="phone" placeholder="Teléfono" value="${club.phone}" required><br>
                <input class="form-control" type="text" id="address" name="address" placeholder="Dirección" value="${club.address}" required><br>
                <input class="form-control" type="text" id="stadiumName" name="stadiumName" placeholder="Nombre del estadio" value="${club.stadiumName}" required><br>
                <button class="btn btn-primary mt-3" type="button" onclick="updateClub(${id})">Actualizar</button>
                <button class="btn btn-danger mt-3" type="button" onclick="location.reload()">Cancelar</button>
            </div>
            
            </form>`
        }
    )

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

    fetch(`${API_BASE_URL}/Club/CreateClub`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(clubData)
    }).then(response => {
        if(response.ok){
              Swal.fire({
                    title: "Creado!",
                    text: "Club creado con éxito",
                    icon: "success"});
            location.reload();
        }else{
             Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Error al crear el club",
                    });
        }
    })
}

function updateClub(id){
      const clubData = {
        id: id,
        name: document.getElementById('name').value,
        city: document.getElementById('city').value,
        email: document.getElementById('email').value,
        numberOfPartners: document.getElementById('numberOfPartners').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        stadiumName: document.getElementById('stadiumName').value
    };

    fetch(`${API_BASE_URL}/Club/UpdateClub`, {
        method: 'Put',
        headers: getAuthHeaders(),
        body: JSON.stringify(clubData)
    }).then(response => {
        if(response.ok){
             Swal.fire({
                    title: "Actualizado!",
                    text: "Club actualizado con éxito",
                    icon: "success"});
            location.reload();
        }else{
             Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Error al crear el club",
                    });
        }
    })
}

function deleteClub(id){
    Swal.fire({
        title: "Estas Seguro?",
        text: "Vas a eliminar el club seleccionado!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Eliminar!",
        cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) { 
            fetch(`${API_BASE_URL}/Club/Delete?id=${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            }).then(response => {
                if(response.ok){
                    Swal.fire({
                    title: "Eliminado!",
                    text: "El club ha sido eliminado.",
                    icon: "success"
                });
                location.reload();
                }else{
                    Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "No se pudo eliminar el club",
                    });
                }
            })
            
        }
    });
}

window.onload = () => loadClubs();