const url_base = `https://liga-libre-awdjddf5a6hpbrbe.brazilsouth-01.azurewebsites.net`;

function loadClubDetail() {
    const querystring = window.location.search
    const params = new URLSearchParams(querystring)
    const id = params.get("id");
   
    fetch(url_base + '/club/id/' + id)
        .then(response => {
            return response.json();
        })
        .then(responseContent => {
            // Acá entra cuando ya tenemos a disposición el resultado del HttpResponse
            renderClubDetail(responseContent);
        });
}

function renderClubDetail(club) {
    const container = document.querySelector('.container');
    container.innerHTML = `<label>Nombre:</label>
            <label>${club.name}`;
}

window.onload = () => loadClubDetail();