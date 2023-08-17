import React, { forwardRef } from 'react';

const ISSInfo = forwardRef(({ lat, lng, crewmembers }, divRef) => (
  <div className="inline-flex flex-col" ref={divRef}>
    <div className="overflow-y-auto max-h-[40rem]">
      <h1 className="text-white text-3xl pb-5 underline font-bold">International Space Station (ISS)</h1>
      <h2 className="text-white mb-2 mt-2 text-center">What is the ISS?</h2>
      <p className="text-white">
        The International Space Station (ISS) is the largest modular space station in low Earth orbit. The project involves five space agencies: the United States' NASA, Russia's Roscosmos, Japan's JAXA, Europe's ESA, and Canada's CSA. The ownership and use of the space station is established by intergovernmental treaties and agreements. The station serves as a microgravity and space environment research laboratory in which scientific research is conducted in astrobiology, astronomy, meteorology, physics, and other fields.
      </p>
      <h2 className="text-white mb-2 mt-2 text-center">Crew members</h2>
      <div className=" text-white grid grid-cols-2 text-center">
        {crewmembers.crew?.map((crewmember) => (
          <p key={crewmember}>{crewmember}</p>
        ))}
      </div>
    </div>
    <div className="inline-flex mt-5 mr-5 text-right justify-end">
      <div className="mr-4 text-white opacity-30">
        <p>Latitude</p>
        <p>Longitude</p>
      </div>
      <div className="mr-4 text-white opacity-50">
        <p>{lat}</p>
        <p>{lng}</p>
      </div>
    </div>
  </div>
));

export default ISSInfo;
