import * as authServises from "./auth.servises.js";
const register = () => {
  const data = authServises.registerService();
  return data;
};

export { register };
