import React, {
  useState, useEffect, useRef, useMemo,
} from 'react';
import Globe from 'react-globe.gl';
import * as THREE from 'three';
import './renderWorld.css';
import globeImage from '../assets/earth-blue-marble.jpg';
import backgroundSky from '../assets/night-sky.png';
import ISSInfo from './ISSInfo';

const EARTH_RADIUS_KM = 6371; // km
const SAT_SIZE = 80; // km
const TIME_STEP = 3 * 1000; // per frame
const ISS_DIST = 0.15;
const DEFAULT_CAMERA_ALTITUDE = 0.4;

function RenderGlobe() {
  const globeEl = useRef();
  const divRef = useRef(null);
  const [globeRadius, setGlobeRadius] = useState();
  const [userCoordinates, setUserCoordinates] = useState({ latitude: 0.0, longitude: 0.0 });
  const [ISSCoordinates, setISSCoordinates] = useState({ latitude: 0.0, longitude: 0.0 });
  const [ISSCrewMembers, setISSCrewMembers] = useState({ crew: [] });
  const [isISSPageVisible, setisISSPageVisible] = useState(false);

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

  const getISSCrewMembers = () => {
    fetch('http://api.open-notify.org/astros.json')
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
  const handleISSClick = ({ ...props }) => {
    smoothCameraTransition(props);
    setisISSPageVisible(!isISSPageVisible);
  };
  useEffect(() => {
    getISSLocation();
    getISSCrewMembers();
    getUsersLocationFromAPI();
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
    <div className="width-100 height-100">
      {/* <button className="bg-white" onClick={handleClick} type="button">test</button> */}
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
      <div>
        <div className="absolute left-20 top-20">
          <h2 className="text-gray-500 text-lg">USER COORDS</h2>
          <h2 className="text-gray-500 text-lg">{userCoordinates.latitude}</h2>
          <h2 className="text-gray-500 text-lg">{userCoordinates.longitude}</h2>
          <h2 className="text-gray-500 text-lg">ISS COORDS</h2>
          <h2 className="text-gray-500 text-lg">{ISSCoordinates.latitude}</h2>
          <h2 className="text-gray-500 text-lg">{ISSCoordinates.longitude}</h2>
        </div>
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
