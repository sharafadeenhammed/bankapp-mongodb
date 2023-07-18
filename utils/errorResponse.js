class ErrorResponse extends Error {
  constructor(message, statusCode) {
    const status = 0;
    super(message);
    this.msg = message;
    this.statusCode = statusCode || 400;
  }
}

export default ErrorResponse;
