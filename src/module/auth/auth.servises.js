import ApiError from "../../common/util/apiError.js";
import User from "./auth.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../common/util/jwt.utils.js";

const generateAccessAndRefreshToken = async (user) => {
  const accessToken = await generateAccessToken({
    id: user.id,
    role: user.role,
  });
  if (!accessToken) {
    throw ApiError.internal("failed to generate accessToken");
  }
  const refreshtoken = await generateRefreshToken({
    id: user.id,
  });
  if (!refreshtoken) {
    throw ApiError.internal("failed to generate refreshToken");
  }
  return { accessToken, refreshtoken };
};

const registerService = async ({ name, email, password, role }) => {
  if (!name || !email || !password || !role) {
    throw ApiError.notFound("All fields are required");
  }

  const existingUserCheck = await User.findOne({ email });
  if (existingUserCheck) throw ApiError.conflict("Email already register");

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  // console.log(user);
  if (!user) {
    throw ApiError.notFound("Error creating user");
  }
  return user;
};

const loginService = async ({ email, password }) => {
  const existingUserCheck = await User.findOne({ email }).select("+password");
  // console.log("existing : - ", existingUserCheck);
  if (!existingUserCheck) {
    throw ApiError.badRequest("user with this email does not exists!");
  }
  const isPasswordMatch = await existingUserCheck.comparePassword(password);
  if (!isPasswordMatch) {
    throw ApiError.badRequest("email or password Wrong");
  }

  const { accessToken, refreshtoken } =
    await generateAccessAndRefreshToken(existingUserCheck);
  existingUserCheck.refreshtoken = refreshtoken;
  await existingUserCheck.save();
  const user = existingUserCheck.toObject();
  delete user.refreshtoken;

  return { user, refreshtoken, accessToken };
};

const getMeServises = async ({ id, role }) => {
  const user = await User.findById(id);
  if (!user) {
    throw ApiError.notFound("User not Found");
  }
  return user;
};

const refreshTokensServises = async (token) => {
  if (!token) {
    throw ApiError.unauthorized("Refresh Token Missing");
  }
  const decode = await verifyRefreshToken(token);
  console.log("decode ;-", decode);

  const user = await User.findById(decode.id).select("+refreshtoken");
  console.log("user : -", user);
  if (!user) {
    throw ApiError.unauthorized("User no longer exists");
  }
  console.log("user.refresh", user.refreshtoken);
  if (user.refreshtoken !== token) {
    throw ApiError.unauthorized("Invalid refresh token — please log in again");
  }
  const { refreshtoken, accessToken } =
    await generateAccessAndRefreshToken(user);
  user.refreshtoken = refreshtoken;
  user.save();

  return { accessToken, refreshtoken };
};

export { registerService, loginService, getMeServises, refreshTokensServises };
