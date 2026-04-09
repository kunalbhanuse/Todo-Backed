class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something Went Wrong",
    error = [],
    data = null,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.error = error;
    this.data = data;
  }

  static badRequest(message = "Bad request", error = []) {
    return new ApiError(400, message, error);
  }

  static unauthorized(message = "unauthorized") {
    return new ApiError(401, message);
  }

  static forbidden(message = "forbidden") {
    return new ApiError(403, message);
  }
  static notFound(message = "Not Found") {
    return new ApiError(404, message);
  }
  static conflict(message = "conflict") {
    return new ApiError(409, message);
  }
  static internal(message = "internal server error") {
    return new ApiError(500, message);
  }
}

export default ApiError;
