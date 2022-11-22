"use strict";

exports.manageError = (next, err) => {
  let error = {};

  if (typeof err === "string") {
    error.message = err;
  }

  if ("message" in err) {
    error.message = err.message;
  }

  error.statusCode = err.statusCode || 500;

  next(error);
};

module.exports.status = {
  success: "success",
  error: "error",
};
