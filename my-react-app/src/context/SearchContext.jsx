import React, { createContext, useState } from 'react';

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [filters, setFilters] = useState(null);
  const [results, setResults] = useState([]);

  return (
    <SearchContext.Provider value={{ filters, setFilters, results, setResults }}>
      {children}
    </SearchContext.Provider>
  );
};
