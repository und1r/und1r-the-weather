const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = express();

app.use(express.json());
app.use(cors());

const genericApiGetRequest = ({
  url, params, method, headers,
}, res) => {
  let formattedParams = '';

  if (params) { formattedParams = new URLSearchParams(params); }
  console.log(`${url}${formattedParams ? `?${formattedParams}` : ''}`, { method, headers });
  fetch(`${url}${formattedParams ? `?${formattedParams}` : ''}`, { method, headers })
    .then((result) => result.json())
    .then((json) => {
      res.send(json);
    })
    .catch((err) => {
      console.log(err.message);
    });
};
// routes

app.get('/', (req, res) => {
  res.send('hello!');
});

app.get('/isscoords', (req, res) => {
  genericApiGetRequest(
    {
      url: 'http://api.open-notify.org/iss-now.json',
      params: false,
      method: 'GET',
    },
    res,
  );
});

app.get('/isscrew', (req, res) => {
  genericApiGetRequest(
    {
      url: 'http://api.open-notify.org/astros.json',
      params: false,
      method: 'GET',
    },
    res,
  );
});

app.get('/ip-geo-lookup', (req, res) => {
  genericApiGetRequest(
    {
      url: 'https://api.ipgeolocation.io/ipgeo',
      params: {
        apiKey: process.env.IPGEOLOCATION_API_KEY,
      },
      method: 'GET',
    },
    res,
  );
});

app.get('/query-location', (req, res) => {
  const { inputValue } = req.query;

  genericApiGetRequest(
    {
      url: 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities',
      params: {
        minPopulation: '100000',
        namePrefix: inputValue,
      },
      headers: {
        'x-rapidapi-key': process.env.GEO_DB_X_RAPIDAPI_KEY,
        'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com',
      },
      method: 'GET',
    },
    res,
  );
});

app.get('/weatherdata', (req, res) => {
  const { lat, lng } = req.query;

  genericApiGetRequest(
    {
      url: 'https://api.openweathermap.org/data/2.5/weather',
      params: {
        lat,
        lon: lng,
        appid: process.env.OPENWEATHERMAP_API_KEY,
        units: 'metric',
      },
      method: 'GET',
    },
    res,
  );
});

app.get('/forecastdata', (req, res) => {
  const { lat, lng } = req.query;

  genericApiGetRequest(
    {
      url: 'https://api.openweathermap.org/data/2.5forecast',
      params: {
        lat,
        lon: lng,
        appid: process.env.OPENWEATHERMAP_API_KEY,
        units: 'metric',
      },
      method: 'GET',
    },
    res,
  );
});

mongoose.set('strictQuery', false);
mongoose.connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@portfoliocluster.l4td9qt.mongodb.net/weather-API?retryWrites=true&w=majority`)
  .then(() => {
    console.log('connected to mongoDB');
    app.listen(4000, () => {
      console.log('Node API app is running on port 4000');
    });
  }).catch((err) => {
    //     console.log(process.env.MONGO_ATLASPW);
    console.log(err);
  });
