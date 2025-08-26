function showWeather(latitude, longitude) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m`;
    fetch(url)
        .then(response => {
            return response.json();
        })
        .then(responseContent => {
            const weather = `${responseContent.current.temperature_2m} ${responseContent.current_units.temperature_2m}`;
            document.getElementById('weather').innerHTML = `
            <ul>
                <li>La temperatura actual es ${weather}</li>
                <li>La longitud es ${responseContent.longitude}</li>
                <li>La latitud es ${responseContent.latitude}</li>
            </ul>
            `;
        });
}

//showWeather(-34.542693170719545, -58.4927969543629);
showWeather(-41.142545161370926, -71.2997478751459);