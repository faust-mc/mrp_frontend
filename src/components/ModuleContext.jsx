import React, { createContext, useState, useContext } from 'react';

const ModuleContext = createContext();

export const ModuleProvider = ({ children }) => {
  const [modules, setModules] = useState([]);
  const [accessPermissions, setAccessPermissions] = useState([]); // State for storing permissions

  return (
    <ModuleContext.Provider value={{ modules, setModules, accessPermissions, setAccessPermissions }}>
      {children}
    </ModuleContext.Provider>
  );
};

export const useModuleContext = () => useContext(ModuleContext);
