    const apiKey = "078f46f1ee0d8cd68232acdf882cc3ea";

    async function getWeather() {
      const city = document.getElementById('cityInput').value;
      if (!city) {
        alert('Please enter a city name!');
        return;
      }

      const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
      document.getElementById('loading').style.display = 'block';
      document.getElementById('weatherResult').innerHTML = '';
      document.getElementById('forecast').innerHTML = '';

      try {
        const response = await fetch(currentWeatherUrl);
        if (!response.ok) throw new Error('City not found');
        const data = await response.json();

        const { coord, weather, main, name, sys } = data;
        const weatherInfo = `
          <h2>${name}, ${sys.country}</h2>
          <p>Temperature: ${main.temp}°C</p>
          <p>Weather: ${weather[0].description}</p>
          <img src="https://openweathermap.org/img/wn/${weather[0].icon}@2x.png" alt="${weather[0].description}">
          <p>Humidity: ${main.humidity}%</p>
        `;
        document.getElementById('weatherResult').innerHTML = weatherInfo;

        // Fetch 5-day forecast
        await getForecast(coord.lat, coord.lon);
      } catch (error) {
        document.getElementById('weatherResult').innerHTML = `<p style="color: red;">${error.message}</p>`;
      } finally {
        document.getElementById('loading').style.display = 'none';
      }
    }

    async function getForecast(lat, lon) {
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

      try {
        const response = await fetch(forecastUrl);
        const data = await response.json();
        const dailyForecasts = data.list.filter((_, index) => index % 8 === 0);

        let forecastHtml = '<h3>5-Day Forecast</h3><div class="forecast">';
        dailyForecasts.forEach((day) => {
          const date = new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
          forecastHtml += `
            <div class="day">
              <p>${date}</p>
              <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="${day.weather[0].description}">
              <p>${day.main.temp}°C</p>
            </div>
          `;
        });
        forecastHtml += '</div>';
        document.getElementById('forecast').innerHTML = forecastHtml;
      } catch (error) {
        document.getElementById('forecast').innerHTML = `<p style="color: red;">Unable to load forecast</p>`;
      }
    }
