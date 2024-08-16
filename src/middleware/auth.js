const jwt = require('jsonwebtoken')

const protect = (req, res, next) => {
  try {
    const bearerToken = req.headers.authorization;
    if (bearerToken && bearerToken.startsWith("Bearer")) {
      const token = bearerToken.split(" ")[1];
      const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);
      req.decoded = decoded;
      next();
    } else {
      next(createError(400, "Server Need Token"));
    }
  } catch (error) {
    if (error && error.name === "TokenExpiredError") {
      next(createError(400, "Expired Token"));
    } else if (error && error.name === "JsonWebTokenError") {
      next(createError(400, "Invalid Token"));
    } else if (error && error.name === "NotBeforeError") {
      next(createError(400, "Inactive Token"));
    } else {
      next(new createError[500]());
    }
  }
};

module.exports = { protect };
