import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import {
  CreateAccessToken,
  CreateRefeshToken,
  ReadRefreshToken,
} from "../utils/auth.token.js";

export const RegisterController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      return res.status(400).json({
        message: "user already existed with this email",
        errors: [
          {
            path: "email",
            msg: "User already exists with this email address",
          },
        ],
      });
    }

    const newuser = await User.create({
      email,
      name,
      password: await bcrypt.hash(password, 12),
    });

    /*
  @token utilisation of access and refresh token 
  @refresh token is on the cookie
  @access token store in db
*/
    const accesstoken = CreateAccessToken({
      userId: newuser._id,
      role: newuser.role,
    });
    const refreshtoken = CreateRefeshToken({
      userId: newuser._id,
      role: newuser.role,
    });

    res.cookie("refreshtoken", refreshtoken, {
      httpOnly: true,
    });
    await User.findByIdAndUpdate(newuser._id, {
      refreshtoken,
    });
    // ====================================================================================================
    // ====================================================================================================
    res.status(201).json({
      message: "User registered successfully",
      data: {
        newuser: {
          email: newuser.email,
          name: newuser.name,
          id: newuser._id,
          role: newuser.role,
        },
        accesstoken,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const LoginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const isExistuser = await User.findOne({ email });

    if (!isExistuser) {
      return res.status(400).json({
        message: "Invalid email or password",
        errors: [{ path: "email", msg: "User not found" }],
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      isExistuser.password,
    );
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
        errors: [{ path: "password", msg: "Incorrect password" }],
      });
    }
    /*
  @token utilisation of access and refresh token 
  @refresh token is on the cookie
  @access token store in db
*/
    const accesstoken = CreateAccessToken({
      userId: isExistuser._id,
      role: isExistuser.role,
    });
    const refreshtoken = CreateRefeshToken({
      userId: isExistuser._id,
      role: isExistuser.role,
    });

    await User.findOneAndUpdate({ email }, { refreshtoken });

    res.cookie("refreshtoken", refreshtoken, {
      httpOnly: true,
    });
    // =================================================================================================
    // =================================================================================================
    res.status(200).json({
      message: "Login successful",
      data: {
        user: {
          id: isExistuser._id,
          email: isExistuser.email,
          name: isExistuser.name,
          role: isExistuser.role,
        },
        accesstoken,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshtoken;
  if (!refreshToken) {
    return res.status(401).json({
      message: "refresh token is required.",
    });
  }
  try {
    const decoded = ReadRefreshToken(refreshToken);
    const { userId, role } = decoded;
    const user = await User.findById(userId);

    if (!user || refreshToken !== user.refreshtoken) {
      if (user) {
        await User.findByIdAndUpdate(user._id, {
          refreshtoken: null,
        });
      }
      return res.status(401).json({
        message: "Refresh token mismatch",
      });
    }

    const accessToken = CreateAccessToken({
      userId,
      role,
    });

    const newRefreshToken = CreateRefeshToken({
      userId,
      role,
    });

    await User.findByIdAndUpdate(user._id, {
      refreshtoken: newRefreshToken,
    });

    res.cookie("refreshtoken", newRefreshToken, {
      httpOnly: true,
    });

    res.status(200).json({
      message: "Tokens rotated successfully.",
      data: {
        user: {
          email: user.email,
          name: user.name,
          id: user._id,
          role: user.role,
        },
        accesstoken: accessToken,
      },
    });
  } catch (error) {
    return res.status(401).json({
      message: "Invalid refresh Token",
    });
  }
};

export const LogoutController = async (req, res) => {
  const refreshToken = req.cookies.refreshtoken;

  if (refreshToken) {
    try {
      const { userId } = ReadRefreshToken(refreshToken);
      const user = await User.findById(userId);
      if (user?.refreshtoken === refreshToken) {
        user.refreshtoken = null;
        await user.save();
      }
    } catch (error) {
      console.error("Logout token invalidation failed:", error);
    }
  }

  res.clearCookie("refreshtoken", { httpOnly: true });
  res.status(200).json({ message: "Logout successful" });
};

export const getMe = async (req, res) => {
  const { userId, role } = req.user;
  const user = await User.findById(userId);
  res.status(200).json({
    message: "User data fetched successfully.",
    data: {
      user: {
        email: user.email,
        name: user.name,
        id: user._id,
        role: user.role,
      },
    },
  });
};
