export const updateUserLocationFromAPI = (setUserCoordinates) => {
  fetch('http://localhost:4000/ip-geo-lookup')
    .then((result) => result.json())
    .then((json) => {
      setUserCoordinates({ latitude: json.latitude, longitude: json.longitude });
    })
    .catch((err) => {
      console.log(err.message);
    });
};

export const updateWeatherData = (searchData, setCurrentWeatherData, setCurrentForecastData) => {
  const [lat, lng] = searchData.value.split(' ');

  const currentWeatherFetch = fetch(`http://localhost:4000/weatherdata?lat=${lat}&lng=${lng}`);
  const forecastFetch = fetch(`http://localhost:4000/forecastdata?lat=${lat}&lng=${lng}`);

  Promise.all([currentWeatherFetch, forecastFetch])
    .then(async (response) => {
      const weatherResponse = await response[0].json();
      const forecastResponse = await response[1].json();

      setCurrentWeatherData({ city: searchData.label, ...weatherResponse });
      setCurrentForecastData({ city: searchData.label, ...forecastResponse });
    })
    .catch((err) => console.log(err));
};

export const updateISSCrewMembers = (setISSCrewMembers) => {
  fetch('http://localhost:4000/isscrew')
    .then((result) => result.json())
    .then((json) => {
      const newCrew = [];
      for (const dude of Object.entries(json.people)) {
        if (dude[1].craft === 'ISS') {
          newCrew.push(dude[1].name);
        }
      }
      setISSCrewMembers({ crew: newCrew });
    })
    .catch((err) => {
      console.log(err.message);
    });
};

export const updateISSLocationLoop = (setISSCoordinates) => {
  const runEverySecond = setInterval(() => {
    fetch('http://localhost:4000/isscoords')
      .then((result) => result.json())
      .then((json) => {
        setISSCoordinates({ latitude: json.iss_position.latitude, longitude: json.iss_position.longitude });
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, 10000);
  return () => clearInterval(runEverySecond);
};

export const updateLoadOptions = (inputValue) => fetch(`http://localhost:4000/query-location?inputValue=${inputValue}`)
  .then((response) => response.json())
  .then((response) => ({
    options: response.data.map((city) => ({
      value: `${city.latitude} ${city.longitude}`,
      label: `${city.name}, ${city.countryCode}`,
    })),
  }));
