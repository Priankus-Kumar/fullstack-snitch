import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { CreateAccessToken, CreateRefeshToken } from "../utils/auth.token.js";

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
      message: "User registration successfully",
      data: {
        newuser: {
          email: newuser.email,
          name: newuser.name,
          id: newuser._id,
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
