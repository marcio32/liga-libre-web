function loadMenu(){
    const menuHTML = `
       <nav class="sidebar">
        <h2>Liga Libre</h2>
         <a href="index.html">Inicio</a>
        <a href="clubs.html">Clubes</a>
        <a href="players.html">Jugadores</a>
        <a href="matches.html">Partidos</a>
        <a href="referees.html">Arbitros</a>
        <a href="statistics.html">Estadisticas</a>
        <a href="#" onclick="logout()">Cerrar sesión</a>
    </nav>
    `;

    document.body.insertAdjacentHTML('afterbegin', menuHTML);
}

document.addEventListener('DOMContentLoaded', loadMenu);