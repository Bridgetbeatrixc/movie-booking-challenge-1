import jwt from "jsonwebtoken";
import { User } from "./auth.model.js";
import { validateRegistration, validateLogin } from "../../shared/utils/validationHelper.js";

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const validationErrors = validateRegistration(name, email, password);

    if (validationErrors.length > 0) {
      res.status(400).json({ message: validationErrors.join(" ") });
      return;
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    
    if (userExists) {
      res.status(400).json({ message: "Email address is already registered in the system." });
      return;
    }

    const user = await User.create({
      name,
      email,
      passwordHash: password,
      role: "user"
    });

    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const validationErrors = validateLogin(email, password);

    if (validationErrors.length > 0) {
      res.status(400).json({ message: validationErrors.join(" ") });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+passwordHash");

    if (user && (await user.matchPassword(password))) {
      const token = jwt.sign(
        {
          userId: user._id.toString(),
          email: user.email,
          role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000
      });

      res.status(200).json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
      return;
    }

    res.status(401).json({ message: "Invalid email or password credentials." });
  } catch (error) {
    next(error);
  }
}

export function logout(_req, res) {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict"
  });
  
  res.status(200).json({ message: "User session successfully terminated." });
}

export async function getCurrentUser(req, res, next) {
  try {
    res.status(200).json({
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role
      }
    });
  } catch (error) {
    next(error);
  }
}
