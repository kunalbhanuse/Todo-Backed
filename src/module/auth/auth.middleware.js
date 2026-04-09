import { ApiResponse } from "../../common/util/apiResponce.js";
import ApiError from "../../common/util/apiError.js";
import { verifyAccessToken } from "../../common/util/jwt.utils.js";

const isLoggedIn = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    // console.log("HEader : - ", header);
    if (!header || !header.startsWith("Bearer")) {
      throw ApiError.unauthorized("Authorization Required");
    }
    const token = header.split(" ")[1];
    if (!token) {
      throw ApiError.unauthorized("token is needed For the AUthorization");
    }
    const decodeToken = await verifyAccessToken(token);
    console.log("decoded :- ", decodeToken);
    if (!decodeToken) {
      throw ApiError.unauthorized("Invalid or Expired Token");
    }
    req.user = decodeToken;
    // console.log("req.user: -", req.user);
    next();
  } catch (error) {
    const statusCode = error.statusCode || 500;

    res.status(statusCode).json({
      success: false,
      message: error.message || "User Should be login to access this ",
      error: error.errors || [],
    });
  }
};

export { isLoggedIn };
