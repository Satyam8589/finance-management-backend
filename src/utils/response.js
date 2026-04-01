
const sendSuccess = (res, message, data = null, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const sendError = (res, message, statusCode = 500, errors = null) => {
  const body = {
    success: false,
    message,
    data: null,
  };

  if (errors !== null) {
    body.errors = errors;
  }

  return res.status(statusCode).json(body);
};

export { sendSuccess, sendError };
