import ApiError from "../../common/util/apiError.js";
import User from "./auth.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../common/util/jwt.utils.js";
import { sendMail } from "../../common/util/sendMail.util.js";
import crypto from "node:crypto";

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
    throw ApiError.badRequest("All fields are required");
  }

  const existingUserCheck = await User.findOne({ email });
  if (existingUserCheck) throw ApiError.conflict("Email already register");

  const secureToken = crypto.randomBytes(16).toString("hex");

  const user = await User.create({
    name,
    email,
    password,
    role,
    emailVerificationToken: secureToken,
    emailVerificationExpires: Date.now() + 1000 * 60 * 60, // 1 hour
  });

  // console.log(user);
  if (!user) {
    throw ApiError.notFound("Error creating user");
  }

  const verifyLink = `http://localhost:3000/auth/verifyEmail?token=${secureToken}`;

  sendMail(
    email, // ✅ correct user email
    "Verify your email",
    `
      <h2>Hello ${name}</h2>
      <p>Click below to verify your email:</p>
      <a href="${verifyLink}">Verify Email</a>
    `,
  ).catch((err) => {
    console.error("Email failed:", err.message);
  });
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

const verifiedEmailService = async (token) => {
  console.log("VERIFY controllere HIT");
  if (!token) {
    throw ApiError.badRequest("Token is required");
  }
  console.log("TOKEN : -", token);

  const user = await User.findOne({
    emailVerificationToken: token,
    emailVerificationExpires: { $gt: Date.now() },
  }).select("+emailVerificationToken +emailVerificationExpires");

  if (!user) {
    throw ApiError.badRequest("Token expired or invalid");
  }

  user.isVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();
  return user;
};
// const sendMailServises = async (to, sub, msg) => {
//   const info = await transporter.sendMail({
//     from: process.env.SMTP_USER,
//     to: to,
//     subject: sub,
//     html: msg,
//   });
//   return info;
// };

export {
  registerService,
  loginService,
  getMeServises,
  refreshTokensServises,
  verifiedEmailService,
  // sendMailServises,
};
