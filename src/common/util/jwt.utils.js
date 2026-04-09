import jwt from "jsonwebtoken";
const generateAccessToken = async (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
};

const verifyAccessToken = async (token) => {
  console.log("VeriFyAccessToken : = runs");
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
};

const generateRefreshToken = async (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};

const verifyRefreshToken = async (token) => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
};

export {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
