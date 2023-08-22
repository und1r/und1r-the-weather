import React, {
  useState, useEffect, useRef, useMemo,
} from 'react';
import Globe from 'react-globe.gl';
import * as THREE from 'three';

import './renderWorld.css';
import globeImage from '../assets/earth-blue-marble.jpg';
import backgroundSky from '../assets/night-sky.png';
import ISSInfo from './ISSInfo';
import Search from './Search';
import CurrentWeather from './CurrentWeather';
import Forecast from './Forecast';
import {
  updateUserLocationFromAPI,
  updateISSLocationLoop,
  updateISSCrewMembers,
  updateWeatherData,
} from '../utils/apiHelper';

const ISS_DIST = 0.15;
const DEFAULT_CAMERA_ALTITUDE = 0.7;

function RenderGlobe() {
  const globeEl = useRef();
  const divRef = useRef(null);
  const [globeRadius, setGlobeRadius] = useState();
  const [userCoordinates, setUserCoordinates] = useState({ latitude: 0.0, longitude: 0.0 });
  const [ISSCoordinates, setISSCoordinates] = useState({ latitude: 0.0, longitude: 0.0 });
  const [ISSCrewMembers, setISSCrewMembers] = useState({ crew: [] });
  const [isISSPageVisible, setisISSPageVisible] = useState(false);
  const [currentWeatherData, setCurrentWeatherData] = useState(null);
  const [currentForecastData, setCurrentForecastData] = useState(null);

  const smoothCameraTransition = ({ ...newLocation }) => {
    const ROTATION_STEPS = 65.0;
    let stepNumber = 1.0;

    let currentCoordinates = globeEl.current.pointOfView();
    const latStepSize = (newLocation.lat - currentCoordinates.lat) / ROTATION_STEPS;
    const lngStepSize = (newLocation.lng - currentCoordinates.lng) / ROTATION_STEPS;
    const altStepSize = (DEFAULT_CAMERA_ALTITUDE - currentCoordinates.altitude) / ROTATION_STEPS;

    function smoothCameraLoop() {
      if (stepNumber >= ROTATION_STEPS) { return; }
      globeEl.current.pointOfView({
        lat: currentCoordinates.lat + latStepSize,
        lng: currentCoordinates.lng + lngStepSize,
        altitude: currentCoordinates.altitude + altStepSize,
      });
      currentCoordinates = globeEl.current.pointOfView();
      stepNumber += 1.0;
      requestAnimationFrame(smoothCameraLoop);
    }
    smoothCameraLoop();
  };

  const handleOnSearchChange = (searchData) => {
    const [lat, lng] = searchData.value.split(' ');

    smoothCameraTransition({ lat, lng });
    updateWeatherData(searchData, setCurrentWeatherData, setCurrentForecastData);
  };

  const handleISSClick = ({ ...props }) => {
    smoothCameraTransition(props);
    setisISSPageVisible(!isISSPageVisible);
  };

  useEffect(() => {
    updateISSLocationLoop(setISSCoordinates);
    updateISSCrewMembers(setISSCrewMembers);
    updateUserLocationFromAPI(setUserCoordinates);
    setGlobeRadius(globeEl.current.getGlobeRadius());
    globeEl.current.pointOfView({ altitude: 3.5 });
  }, []);

  const createISS = useMemo(() => {
    if (!globeRadius) return undefined;

    const issGeometry = new THREE.OctahedronGeometry(7, 0);
    const issMaterial = new THREE.MeshLambertMaterial({ color: 'palegreen', transparent: true, opacity: 0.9 });
    return new THREE.Mesh(issGeometry, issMaterial);
  }, [globeRadius]);

  useEffect(() => {
    smoothCameraTransition({ lat: userCoordinates.latitude, lng: userCoordinates.longitude });
  }, [userCoordinates]);

  useEffect(() => {
    if (isISSPageVisible) { smoothCameraTransition({ lat: ISSCoordinates.latitude, lng: ISSCoordinates.longitude }); }
  }, [ISSCoordinates]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      console.log(divRef);
      if (divRef && !divRef?.current?.contains(e.target)) {
        if (isISSPageVisible) {
          setisISSPageVisible(!isISSPageVisible);
        }
      }
    };
    const outsideBoxClick = setTimeout(() => {
      document.addEventListener('click', handleOutsideClick, true);
    }, 100);

    return () => {
      clearTimeout(outsideBoxClick);
      document.removeEventListener('click', handleOutsideClick, true);
    };
  });

  return (
    <div>
      <Globe
        ref={globeEl}
        globeImageUrl={globeImage}
        backgroundImageUrl={backgroundSky}
        objectsData={[{
          name: 'ISS', lat: ISSCoordinates.latitude, lng: ISSCoordinates.longitude, alt: ISS_DIST,
        }]}
        objectLabel="name"
        objectLat="lat"
        objectLng="lng"
        objectAltitude="alt"
        objectFacesSurface={false}
        objectThreeObject={createISS}
        onObjectClick={handleISSClick}
      />
      {/* <button className="bg-white" onClick={handleClick} type="button">test</button> */}
      <div>
        <div className="absolute left-20 top-20">
          <h2 className="text-gray-500 text-lg">USER COORDS</h2>
          <h2 className="text-gray-500 text-lg">{userCoordinates.latitude}</h2>
          <h2 className="text-gray-500 text-lg">{userCoordinates.longitude}</h2>
          <h2 className="text-gray-500 text-lg">ISS COORDS</h2>
          <h2 className="text-gray-500 text-lg">{ISSCoordinates.latitude}</h2>
          <h2 className="text-gray-500 text-lg">{ISSCoordinates.longitude}</h2>
        </div>
        <div className="absolute w-1/3 top-10 left-1/3 opacity-90">
          <Search onSearchChange={handleOnSearchChange} />
        </div>
        {currentWeatherData
        && (
        <div className="absolute w-2/3 top-32 left-1/6 opacity-90">
          <CurrentWeather weatherData={currentWeatherData} />
          <Forecast />
        </div>
        )}
        <div className={`${isISSPageVisible ? '' : 'hidden'} bg-iss-background absolute
         right-20 top-20 max-w-lg p-5 opacity-80`}
        >
          <ISSInfo lat={ISSCoordinates.latitude} lng={ISSCoordinates.longitude} crewmembers={ISSCrewMembers} ref={divRef} />
        </div>
      </div>
    </div>
  );
}

export default RenderGlobe;
