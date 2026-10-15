import { ReadAccessToken } from "../utils/auth.token.js";

export const authenticate = (req, res, next) => {
  const accessToken = req.headers.authorization?.split(" ")[1];
  try {
    const decoded = ReadAccessToken(accessToken);
    req.user = decoded;
    next();
  } catch (error) {
    console.log("error from the middleware.js",error);
  }
};

export const authenicateSeller = (req, res, next) => {
  if (req.user.role !== "seller") {
    return res.status(403).json({
      message: "user is not authorized to perform this action.",
    });
  }
  next();
};
