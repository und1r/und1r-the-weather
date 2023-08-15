import React, {
  useState, useEffect, useRef, useMemo,
} from 'react';
import Globe from 'react-globe.gl';
import * as satellite from 'satellite.js';
import * as THREE from 'three';
import './renderWorld.css';
import { extend } from 'react-three-fiber';
import globeImage from '../assets/earth-blue-marble.jpg';
import backgroundSky from '../assets/night-sky.png';
import { useGetISSLocationQuery } from '../services/coordApi';
import { getUserLocationFromAPI } from '../utils/ipGeoLocationApi';

const EARTH_RADIUS_KM = 6371; // km
const SAT_SIZE = 80; // km
const TIME_STEP = 3 * 1000; // per frame
const ISS_DIST = 0.15;

function RenderGlobe(props) {
  const globeEl = useRef();
  const [globeRadius, setGlobeRadius] = useState();
  const [userCoordinates, setUserCoordinates] = useState({ latitude: 0.0, longitude: 0.0 });
  const [ISSCoordinates, setISSCoordinates] = useState({ latitude: 0.0, longitude: 0.0 });

  const getISSLocation = () => {
    const runEverySecond = setInterval(() => {
      fetch('http://api.open-notify.org/iss-now.json')
        .then((result) => result.json())
        .then((json) => {
          ISSCoordinates.latitude = json.iss_position.latitude;
          ISSCoordinates.longitude = json.iss_position.longitude;
          setISSCoordinates({ ...ISSCoordinates });
        })
        .catch((err) => {
          console.log(err.message);
        });
    }, 10000);
    return () => clearInterval(runEverySecond);
  };

  const getUsersLocationFromAPI = () => {
    fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.REACT_APP_IPGEOLOCATION_API_KEY}`)
      .then((result) => result.json())
      .then((json) => {
        console.log(json);
        userCoordinates.latitude = json.latitude;
        userCoordinates.longitude = json.longitude;
        setUserCoordinates({ ...userCoordinates });
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  useEffect(() => {
    getISSLocation();
    getUsersLocationFromAPI();
    setGlobeRadius(globeEl.current.getGlobeRadius());
    globeEl.current.pointOfView({ altitude: 3.5 });
  }, []);

  const satObject = useMemo(() => {
    if (!globeRadius) return undefined;

    const satGeometry = new THREE.OctahedronGeometry(7, 0);
    const satMaterial = new THREE.MeshLambertMaterial({ color: 'palegreen', transparent: true, opacity: 0.9 });
    return new THREE.Mesh(satGeometry, satMaterial);
  }, [globeRadius]);

  const handleClick = () => {
    console.log(globeEl.current);
    // console.log(globeEl.current.renderer());
    // console.log(THREE.MathUtils.lerp(globeEl.current.pointOfView(), 1));
    // console.log(globeEl.current.pointOfView(({ lat: userCoordinates.latitude, lng: userCoordinates.longitude, altitude: 0.4 })));
    // console.log(globeEl.current.camera().position.lookAt(globeEl.current.pointOfView()));
    // globeEl.current.camera().position = newPosition;
  };

  // useLayoutEffect(() => {

  // }, [])
  return (
    <div className="relative">
      <Globe
        ref={globeEl}
        globeImageUrl={globeImage}
        backgroundImageUrl={backgroundSky}
        objectsData={[{
          name: 'ISS', lat: ISSCoordinates.latitude, lng: ISSCoordinates.longitude, alt: ISS_DIST,
        }]}
      //   objectsData={[]}
        objectLabel="name"
        objectLat="lat"
        objectLng="lng"
        objectAltitude="alt"
        objectFacesSurface={false}
        objectThreeObject={satObject}
      />
      <div className="absolute left-20 top-20">
        <h2 className="text-gray-500 text-lg">USER COORDS</h2>
        <h2 className="text-gray-500 text-lg">{userCoordinates.latitude}</h2>
        <h2 className="text-gray-500 text-lg">{userCoordinates.longitude}</h2>
        <h2 className="text-gray-500 text-lg">ISS COORDS</h2>
        <h2 className="text-gray-500 text-lg">{ISSCoordinates.latitude}</h2>
        <h2 className="text-gray-500 text-lg">{ISSCoordinates.longitude}</h2>
        <button className="bg-white" onClick={handleClick} type="button">test</button>
      </div>
      {/* <div id="time-log">{time.toString()}</div> */}
    </div>
  //     <Globe
  //       globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
  //       backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
  //       labelsData={places}
  //       labelLat={(d) => d.properties.latitude}
  //       labelLng={(d) => d.properties.longitude}
  //       labelText={(d) => d.properties.name}
  //       labelSize={(d) => Math.sqrt(d.properties.pop_max) * 4e-4}
  //       labelDotRadius={(d) => Math.sqrt(d.properties.pop_max) * 4e-4}
  //       labelColor={() => 'rgba(255, 165, 0, 0.75)'}
  //       labelResolution={2}
  //     />
  );
}

export default RenderGlobe;
