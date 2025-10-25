async function loadStatistics() {
    try {
        debugger
        const [leagueStats, matchStats ,playerStats] = await Promise.all([
            loadLeagueStatistics(),
            loadMatchStatistics(),
            loadPlayerStatistics()
        ]);

        renderLeagueStatistics(leagueStats);
        renderMatchStatistics(matchStats);
        renderPlayerStatistics(playerStats);
        renderStandings(leagueStats.standings);
        renderTopScorers(leagueStats.topScorers);
    }
    catch (error) {}
}

async function loadLeagueStatistics() {
    const response = await fetch(`${CONFIG.API_BASE_URL}/Statistics/League`, {
    headers: CONFIG.getAuthHeaders()
    });
    return await response.json();
}


async function loadMatchStatistics() {
    const response = await fetch(`${CONFIG.API_BASE_URL}/Statistics/Matches`, {
    headers: CONFIG.getAuthHeaders()
    });
    return await response.json();
}


async function loadPlayerStatistics() {
    const response = await fetch(`${CONFIG.API_BASE_URL}/Statistics/Players`, {
    headers: CONFIG.getAuthHeaders()
    });
    return await response.json();
}

function renderLeagueStatistics(stats) {
    const container = document.getElementById('leagueStats');
    container.innerHTML = `
    <div class="stat-item">
        <h6>Total de Partidos</h6>
        <p>${stats.totalMatches}</p>
    </div>
    <div class="stat-item">
        <h6>Partidos Finalizados</h6>
        <p>${stats.finishedMatches}</p>
    </div>
    <div class="stat-item">
        <h6>Partidos Programados</h6>
        <p>${stats.scheduledMatches}</p>
    </div>
    <div class="stat-item">
        <h6>Total de Goles</h6>
        <p>${stats.totalGoals}</p>
    </div>
    <div class="stat-item">
        <h6>Promedio de Goles</h6>
        <p>${stats.averageGoalsPerMatch}</p>
    </div>
    <div class="stat-item">
        <h6>Total de clubes</h6>
        <p>${stats.totalClubs}</p>
    </div>
    <div class="stat-item">
        <h6>Total de jugadores</h6>
        <p>${stats.totalPlayers}</p>
    </div>
    `
}

function renderMatchStatistics(stats) {
    const container = document.getElementById('matchStats');
    container.innerHTML = `
    <div class="stat-item">
        <h6>Total de Partidos</h6>
        <p>${stats.totalMatches}</p>
    </div>
    <div class="stat-item">
        <h6>Partidos Finalizados</h6>
        <p>${stats.finishedMatches}</p>
    </div>
    <div class="stat-item">
        <h6>Partidos Programados</h6>
        <p>${stats.scheduledMatches}</p>
    </div>
    <div class="stat-item">
        <h6>Partidos en Progreso</h6>
        <p>${stats.inProgressMatches}</p>
    </div>
    <div class="stat-item">
        <h6>Partidos Pospuestos</h6>
        <p>${stats.postponedMatches}</p>
    </div>
    <div class="stat-item">
        <h6>Partidos Cancelados</h6>
        <p>${stats.cancelledMatches}</p>
    </div>
    <div class="stat-item">
        <h6>% Completados</h6>
        <p>${stats.completionPercentage}</p>
    </div>
    `
}

function renderPlayerStatistics(stats) {
    const container = document.getElementById('playerStats');
    container.innerHTML = `
    <div class="stat-item">
        <h6>Total de Jugadores</h6>
        <p>${stats.totalPlayers}</p>
    </div>
    <div class="stat-item">
        <h6>Jugadores Activos</h6>
        <p>${stats.activePlayers}</p>
    </div>
    <div class="stat-item">
        <h6>Edad Promedio</h6>
        <p>${stats.averageAge.toFixed(1)}</p>
    </div>
    `

    if(stats.positionStats && stats.positionStats.length > 0){
        debugger
         const positionStats = stats.positionStats.map(pos=> {
            `<div class="stat-item">
            <h6>${pos.position}}</h6>
            <p>${stats.playerCount}</p>
            <small>(Promedio: ${stats.averageAge}%)</small>
            </div>`
         }).join('');

         container.innerHTML += `
            <hr>
            <h6>Por Posicion</h6>
            ${positionStats}
         `;
    }
}

function renderStandings(standings){
     const data = standings.map((team, index) => [
        `${index + 1}. ${team.clubName}`,
        team.matchesPlayed,
        team.wins,
        team.draws,
        team.losses,
        team.points
     ]);


     $('#standingsTable').DataTable({
        data: data,
         language: {
            url: 'https://cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json'
        }
     })
}

function renderTopScorers(topScorers){
    debugger
     const data = topScorers.map((team, index) => [
        `${index + 1}. ${team.playerName}`,
        team.clubName,
        team.goals
     ]);


     $('#topScorersTable').DataTable({
        data: data,
         language: {
            url: 'https://cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json'
        }
     })
}

const style = document.createElement('style');
style.textContent =`
    .main-content{
        overflow-x: auto;
        padding: 40px;
        background: #fafafa;
        height: 100%;
    }
    
    .main-content h1{
        color: #1a1a1a;
        font-size: 2rem;
        font-weight: 300;
        margin-bottom: 40px;
        letter-spacing: -0.5px;
    }

    .stat-item{
        margin-bottom: 12px;
        padding: 24px;
        background: #e1e1e1;
        border-radius: 8px;
        border-left: 3px solid #2a2a2a;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
        transition: all 0.2s ease;
    }
    
    .stat-item:hover{
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transform: translateX(2px);
    }
    
    .stat-item h6{
        margin-bottom: 8px;
        color: #6b6b6b;
        font-size: 0.75rem;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 1px;
    }
    
    .stat-item p{
        color: #1a1a1a;
        font-size: 2.25rem;
        font-weight: 300;
        margin: 0;
    }
    
    .stat-item small{
        color: #9b9b9b;
        font-size: 0.75rem;
    }

    .card {
        margin-bottom: 24px;
        border-radius: 8px;
        border: 1px solid #e5e5e5;
        box-shadow: none;
        overflow: hidden;
        background: #fff;
    }
    
    .card-header{
        background: #fff;
        color: #1a1a1a;
        font-weight: 500;
        font-size: 0.875rem;
        padding: 16px 20px;
        border-bottom: 1px solid #e5e5e5;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .table th{
        background-color: #f5f5f5;
        color: #4a4a4a;
        font-weight: 500;
        font-size: 0.75rem;
        border: none;
        padding: 12px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    .table td{
        padding: 12px;
        vertical-align: middle;
        color: #2a2a2a;
        font-size: 0.875rem;
        border-bottom: 1px solid #f0f0f0;
    }
    
    .table-striped tbody tr:nth-of-type(odd){
        background-color: #fafafa;
    }
    
    .table-hover tbody tr:hover{
        background-color: #f5f5f5;
    }

    @media (max-width: 768px) {
        .main-content{
            padding: 10px;
        }
        
        .main-content h1{
            font-size: 1.75rem;
            margin-bottom: 20px;
        }
        
        .stat-item{
            padding: 15px;
            margin-bottom: 10px;
        }
        
        .stat-item p{
            font-size: 1.5rem;
        }
        
        .stat-item h6{
            font-size: 0.75rem;
        }
        
        .card-header{
            padding: 12px 15px;
            font-size: 0.9rem;
        }
        
        .table th, .table td{
            padding: 8px;
            font-size: 0.85rem;
        }
    }

    @media (max-width: 480px) {
        .main-content{
            padding: 5px;
        }
        
        .main-content h1{
            font-size: 1.5rem;
            margin-bottom: 15px;
        }
        
        .stat-item{
            padding: 12px;
            margin-bottom: 8px;
        }
        
        .stat-item p{
            font-size: 1.25rem;
        }
        
        .stat-item h6{
            font-size: 0.7rem;
        }
        
        .table th, .table td{
            padding: 6px;
            font-size: 0.75rem;
        }
    }
`;

document.head.appendChild(style);

window.onload = () => loadStatistics();