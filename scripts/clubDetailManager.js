function getAuthHeaders() {
 const token = localStorage.getItem('token');
 return {
     'Content-Type': 'application/json',
     'Authorization': `Bearer ${token}`
 }
}

async function loadClubDetail() {
    const querystring = window.location.search;
    const params = new URLSearchParams(querystring);
    const id = params.get('id');
    if(!id){
        alert('ID de club no proporcionado');
        return;
    }

    fetch(`${API_BASE_URL}/Club/GetById?id=${id}`, {
        headers: getAuthHeaders()
    }).then(response => {
        if(!response.ok){
            throw new Error('Club no encontrado')
        }
        return response.json();
    }).then(responseContent => {
        renderClubDetail(responseContent);
    });
}

function renderClubDetail(club) {
    const containerClubDetail = document.querySelector('#containerClubDetail');
    containerClubDetail.innerHTML = `
        <div class="card">
        <h2>${club.name}</h2>
            <div class="club-info">
                <p><strong>Ciudad:</strong> ${club.city}</p>
                <p><strong>Email:</strong> ${club.email}</p>
                <p><strong>Telefono:</strong> ${club.phone}</p>
                <p><strong>Direccion:</strong> ${club.address}</p>
                <p><strong>Estado:</strong> ${club.stadiumName}</p>
                <p><strong>Numero de Socios:</strong> ${club.numberOfPartners}</p>
            </div>
            <button onclick="window.history.back()" class="btn btn-secondary">Volver</button>
        </div>
    `;
}

window.onload = () => loadClubDetail();