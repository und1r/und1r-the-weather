import React from 'react';

function CurrentWeather({ weatherData }) {
  return (
    <div className="rounded-md drop-shadow-xl text-white bg-slate-900 pt-0 px-20 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold text-lg leading-none m-0 tracking-tight">{weatherData.city}</p>
          <p className="font-normal text-sm leading-none m-0">{weatherData.weather[0].description}</p>
        </div>
        <img alt="weather" className="w-[100px]" src={`icons/${weatherData.weather[0].icon}.png`} />
      </div>
      <div className="flex justify-between items-center">
        <p className="font-semibold text-7xl w-auto tracking-tighter my-10 mx-0">
          {Math.round(weatherData.main.temp)}
          °C
        </p>
        <div className="w-100 pl-20">
          <div className="flex justify-between">
            <span className="text-left font-normal text-xs">Details</span>
          </div>
          <div className="flex justify-between">
            <span className="text-left font-normal text-xs">Feels like</span>
            <span className="text-right font-semibold text-xs">
              {Math.round(weatherData.main.feels_like)}
              °C
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-left font-normal text-xs">Wind</span>
            <span className="text-right font-semibold text-xs">
              {weatherData.wind.speed}
              {' '}
              m/s
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-left font-normal text-xs">Humidity</span>
            <span className="text-right font-semibold text-xs">
              {weatherData.main.humidity}
              %
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-left font-normal text-xs">Pressure</span>
            <span className="text-right font-semibold text-xs">
              {weatherData.main.pressure}
              {' '}
              hPa
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CurrentWeather;
