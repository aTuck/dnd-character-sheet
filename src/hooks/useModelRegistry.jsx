import React, { createContext, useContext, useState } from "react";

const ModelContext = createContext();

export const ModelRegistryProvider = ({ children }) => {
  const [models, setModels] = useState({});

  const setModelRegistry = (modelId, model) => {
    console.log("modelRegistry: Setting model", modelId, model);
    setModels((models) => ({
      ...models,
      [modelId]: model,
    }));
  };

  return (
    <ModelContext.Provider
      value={{
        models,
        setModels: setModelRegistry,
      }}
    >
      {children}
    </ModelContext.Provider>
  );
};

export const useModelRegistry = (modelId) => {
  const { models, setModels } = useContext(ModelContext);
  const model = models?.[modelId] || {};

  return [model, setModels];
};
