import React, { useState } from 'react';
import { AsyncPaginate } from 'react-select-async-paginate';
import { updateLoadOptions } from '../utils/apiHelper';

function Search({ onSearchChange }) {
  const [search, setSearch] = useState(null);

  const handleSearchChange = (searchData) => {
    setSearch(searchData);
    onSearchChange(searchData);
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      borderRadius: '5px',
      border: '2px solid #ccc',
      boxShadow: state.isFocused ? '0 0 0 2px #3699FF' : null,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#3699FF' : null,
      color: state.isFocused ? 'green' : null,
    }),
  };
  return (
    <div className="bg-slate-700 border-2 border-gray-800 rounded-md">
      <AsyncPaginate
        placeholder="Search for city"
        debounceTimeout={2000}
        value={search}
        onChange={handleSearchChange}
        loadOptions={updateLoadOptions}
        styles={customStyles}
      />
    </div>
  );
}

export default Search;
