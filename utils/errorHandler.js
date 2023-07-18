let resData = {};
async function errorHandler(data, req, res, next) {
  // console.log(data.message);
  // console.log(data.code, data.keyValue);

  // checking if error is a duplicate field error
  if (data.code === 11000) {
    const keys = Object.keys(data.keyValue);
    const values = Object.values(data.keyValue);
    data.message = `${keys[0]} already used by another user`;
    data.statusCode = 400;
  }
  res.status(data.statusCode || 500).json({
    success: false,
    message: data.message,
    stack: data.stack,
    data: resData,
  });
}

export default errorHandler;
