import { createContext, useContext, useState, useEffect } from "react";

const ActionsContext = createContext();

export function ActionsProvider({ children }) {
  const [actions, setActions] = useState(() => {
    const stored = localStorage.getItem("acciones");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("acciones", JSON.stringify(actions));
  }, [actions]);

  const addActions = (newOnes) => {
    const withDefaults = newOnes.map((a) => ({
      ...a,
      cantidad: a.cantidad || 1,
      fecha: new Date().toLocaleDateString(),
    }));

    const combined = [...actions, ...withDefaults];

    // 🔹 Mantener solo la última acción con el mismo nombre
    const unique = combined.reduce((acc, curr) => {
      acc[curr.nombre] = curr;
      return acc;
    }, {});

    setActions(Object.values(unique));
  };

  const removeAction = (index) => {
    setActions((prev) => prev.filter((_, i) => i !== index));
  };

  const updateAction = (index, updated) => {
    setActions((prev) => prev.map((a, i) => (i === index ? { ...a, ...updated } : a)));
  };

  return (
    <ActionsContext.Provider value={{ actions, addActions, removeAction, updateAction }}>
      {children}
    </ActionsContext.Provider>
  );
}

export const useActions = () => useContext(ActionsContext);
