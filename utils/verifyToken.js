import jwt from "jsonwebtoken";
import createError from "./error.js";

export async function verifyToken(req, res, next) {
  const token = req.cookies.access_token;
  if (!token) {
    return next(createError(401, "Your are not Authenticated."));
  }

  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) {
      return next(createError(403, "Token is not valid."));
    }
    req.user = user;
  });
  next();
}

export async function verifyUser(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, "You are not authorized."));
    }
  });
}

export async function verifyAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, "You are not authorized."));
    }
  });
}
