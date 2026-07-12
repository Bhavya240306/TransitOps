
// Last middleware in the chain (registered in app.js after all routes).
// Catches anything thrown or passed to next(err), including raw Sequelize
// errors, and turns them into the same clean { success, error } shape
// every other response uses — so the frontend never has to special-case
// a crash versus a normal validation failure.

function errorHandler(err, req, res, next) {
  console.error(err);

  // Sequelize unique constraint violation (e.g. duplicate registration
  // number, duplicate email, duplicate license number)
  if (err.name === 'SequelizeUniqueConstraintError') {
    const field = err.errors?.[0]?.path || 'field';
    return res.status(409).json({
      success: false,
      error: { message: `${field} already exists`, code: 'DUPLICATE_ENTRY' },
    });
  }

  // Sequelize model validation errors (e.g. invalid email format)
  if (err.name === 'SequelizeValidationError') {
    const message = err.errors?.[0]?.message || 'Validation failed';
    return res.status(400).json({
      success: false,
      error: { message, code: 'VALIDATION_ERROR' },
    });
  }

  // Fallback: anything unexpected
  return res.status(err.statusCode || 500).json({
    success: false,
    error: {
      message: err.message || 'Something went wrong',
      code: err.code || 'INTERNAL_ERROR',
    },
  });
}

module.exports = errorHandler;
