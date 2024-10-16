import { UnauthenticatedError, UnauthorizedError } from "../errors/index.js";
import { isTokenVarified } from "../utils/jwt.js";

const authenticationUser = async (req, res, next) => {
  const token = req.signedCookies.token;
  if (!token) {
    throw new UnauthenticatedError("Authentication Invalid");
  }

  try {
    const { name, userId, role } = isTokenVarified({ token });
    // console.log(payload);
    req.user = {
      name,
      userId,
      role,
    };
    next();
  } catch (error) {
    console.log("Authentication Error: " + error);
  }
};

const authorizedPermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnauthorizedError("Unauthorized to access this route");
    }
    next();
  };
};

export { authenticationUser, authorizedPermissions };
