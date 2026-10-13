import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";

export function CreateAccessToken({ userId, role }) {
  const accesstoken = jwt.sign(
    {
      userId,
      role,
    },
    process.env.ACCESS_TOKEN,
    { expiresIn: "15m" },
  );
  return accesstoken;
}

export function ReadAccessToken(accesstoken) {
  return jwt.verify(accesstoken, process.env.ACCESS_TOKEN);
}

export function CreateRefeshToken({ userId, role }) {
  const refreshtoken = jwt.sign(
    {
      userId,
      role,
    },
    process.env.REFRESH_TOKEN,
    { expiresIn: "7d" },
  );
  return refreshtoken;
}

export function ReadRefreshToken(refreshtoken) {
  return jwt.verify(refreshtoken, process.env.REFRESH_TOKEN);
}
