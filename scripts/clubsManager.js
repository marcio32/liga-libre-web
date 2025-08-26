const url_base = `https://liga-libre-awdjddf5a6hpbrbe.brazilsouth-01.azurewebsites.net`;
// {protocolo}://{hostname}:{puerto}

function loadClubs() {
    // /{ruta del recurso}
    fetch(url_base + '/club/all')
        .then(response => {
            return response.json();
        })
        .then(responseContent => {
            // Acá entra cuando ya tenemos a disposición el resultado del HttpResponse
            renderClubs(responseContent);
        });
}

function renderClubs(clubs) {
    const tbody = document.querySelector('#clubsTable tbody')

    clubs.forEach(club => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${club.id}</td>
                         <td>${club.name}</td>
                         <td>${club.city}</td>
                         <td>${club.email}</td>
                         <td>${club.numberOfPartners}</td>
                         <td>${club.phone}</td>
                         <td>${club.address}</td>
                         <td>${club.stadiumName}</td>
                         <td><a href="www.google.com">ver</td>
                        `;
        tbody.appendChild(row);
    });
}

window.onload = () => loadClubs();