
// Every controller in the project (auth, vehicles, drivers, trips, ...)
// should use these two helpers instead of calling res.json() directly,
// so the frontend can always rely on the same { success, data } /
// { success, error } shape regardless of who wrote the endpoint.

function success(res, data, statusCode = 200) {
  return res.status(statusCode).json({ success: true, data });
}

function error(res, message, statusCode = 400, code = 'ERROR') {
  return res.status(statusCode).json({
    success: false,
    error: { message, code },
  });
}

module.exports = { success, error };
