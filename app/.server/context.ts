import { createContext } from "react-router";

export const AppContext = {
  permissions: createContext<string[]>([]),
};
