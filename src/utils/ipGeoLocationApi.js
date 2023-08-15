import axios from 'axios';

const ipGeoLocationAPI = axios.create({
  baseURL: 'https://api.ipgeolocation.io',
  params: {
    apiKey: process.env.REACT_APP_IPGEOLOCATION_API_KEY,
  },
});
export const getUserLocationFromAPI = () => {
  fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.REACT_APP_IPGEOLOCATION_API_KEY}`)
    .then((result) => result.json())
    .then((json) => {
      console.log(`returning ${Object.keys(json)}`);
      return { json };
    })
    .catch((err) => {
      console.log(err.message);
      return false;
    });
};
// export const getUserLocationFromAPI = async () => {
//   console.log('inside external api');
//   try {
//     const { data } = await ipGeoLocationAPI.get('/ipgeo');
//     return data;
//   } catch (error) {
//     console.log('error');
//   }
//   return false;
// };

export default getUserLocationFromAPI;
