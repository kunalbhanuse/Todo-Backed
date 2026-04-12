import * as authServises from "./auth.servises.js";
import { ApiResponse } from "../../common/util/apiResponce.js";
import {
  registrationValidationZod,
  loginValidationZod,
} from "./dto/register.dto.js";

const register = async (req, res) => {
  try {
    const validateReqBody = registrationValidationZod.parse(req.body);
    const user = await authServises.registerService(validateReqBody);
    if (!user) {
      return res
        .status(404)
        .json(new ApiResponse(404, user, "user register failed"));
    }
    res
      .status(201)
      .json(new ApiResponse(201, user, "User Registration Succeful !"));
  } catch (error) {
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message || "internal server error",
      error: error.errors || [],
    });
  }
};

const login = async (req, res) => {
  try {
    const validateloginReqBody = await loginValidationZod.parse(req.body);
    const { user, refreshtoken, accessToken } =
      await authServises.loginService(validateloginReqBody);
    if (!user) {
      return res.status(404).json(new ApiResponse(404, "unable to login "));
    }
    const options = {
      httpOnly: true,
      secure: false,
    };
    return res
      .status(201)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshtoken, options)
      .json(
        new ApiResponse(
          201,
          { user, accessToken, refreshtoken },
          "Login succesfull",
        ),
      );
  } catch (error) {
    const statusCode = error.statusCode || 500;

    res.status(statusCode).json({
      success: false,
      message: error.message || " login Failed",
      error: error.errors || [],
    });
  }
};
const logout = async (req, res) => {
  // console.log("REQ>USER :-", req.user);
  const user = await authServises.logutServises(req.user);
  const options = {
    httpOnly: true,
    secure: false,
  };
  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(201, user, "Logout Succefully "));
};

const getMe = async (req, res) => {
  const user = await authServises.getMeServises(req.user);
  if (!user) {
    return res.status(401).json(new ApiResponse(401, null, "User not found"));
  }
  res.status(201).json(new ApiResponse(201, user, "User featched Succefully"));
};

const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    const { accessToken, refreshtoken } =
      await authServises.refreshTokensServises(token);
    res.cookie("refreshToken", refreshtoken, {
      httpOnly: true,
      secure: false,
    });
    res
      .status(201)
      .json(new ApiResponse(201, accessToken, "Access tooken revised"));
  } catch (error) {
    const statusCode = error.status || 400;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "failed to refresh the tokens",
      error: error.errors || [],
    });
  }
};

const verifyEmail = async (req, res) => {
  try {
    console.log("VERIFY controllere HIT");
    const { token } = req.query;
    const user = await authServises.verifiedEmailService(token);
    return res.status(200).json({
      success: true,
      data: user,
      message: "Email verified successfully 🎉",
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};
const forgetpassword = async (req, res) => {
  const messsage = await authServises.forgetpasswordServises(req.body.email);
  res
    .status(201)
    .json(
      new ApiResponse(201, messsage, "Forget passsword mail sent succesfully"),
    );
};

const resetPassword = async (req, res) => {
  const message = await authServises.resetPasswordServises(req.body);
  res
    .status(201)
    .json(new ApiResponse(201, message, "reser passsword succesfully"));
};
// const sendMail = async (req, res) => {
//   try {
//     const mail = await authServises.sendMailServises(
//       "kingtraders11@gmail.com",
//       "this is subject",
//       "<h1>This is mail</h1>",
//     );

//     res.status(200).json({
//       success: true,
//       message: "Mail sent",
//       data: mail,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

export {
  register,
  login,
  getMe,
  refreshToken,
  verifyEmail,
  logout,
  forgetpassword,
  resetPassword,
  //  sendMail
};
