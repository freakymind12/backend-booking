require('dotenv').config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../models/users");
const mailService = require("../services/mailer")
const mailTemplate = require("../utils/forgotPasswordMail")
const security = require("../utils/crypto")
const { handleResponse, handleError } = require("../utils/responseUtils");
const { validationResult } = require('express-validator');


const authController = {
  loginUser: async (req, res) => {
    const { email, password } = req.body;
    try {
      const [user] = await userModel.getUser({ email }, true);
      if (!user) {
        return handleResponse(res, "Email is not registered", 401);
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return handleResponse(res, "Wrong password", 401);
      }

      const payload = {
        id_user: user.id_user,
        role: user.roles,
        username: user.username,
      };

      const refresh_secret = process.env.REFRESH_TOKEN_SECRET;
      const access_secret = process.env.ACCESS_TOKEN_SECRET;

      const expiresIn = process.env.JWT_EXPIRESIN;

      const refresh_token = jwt.sign(payload, refresh_secret, {
        expiresIn: expiresIn,
      });

      const access_token = jwt.sign(payload, access_secret, {
        expiresIn: "1h",
      });

      res.cookie("refresh_token", refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Hari
        path: "/",
      });

      return res.status(200).json({
        data: { ...payload, access_token },

      });
    } catch (error) {
      handleError(res, error);
    }
  },

  refreshToken: async (req, res) => {
    const user = req.user;
    const access_secret = process.env.ACCESS_TOKEN_SECRET;
    const accessToken = jwt.sign(
      { id: user.id_user, email: user.email },
      access_secret,
      { expiresIn: "1h" }
    );
    res.json({ access_token: accessToken });
  },

  logoutUser: async (req, res) => {
    await res.clearCookie("refresh_token", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
    handleResponse(res, "Logout Success");
  },

  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body
      const [user] = await userModel.getUser(req.body);

      if (!user) {
        return handleResponse(res, "Email is not registered", 401);
      }

      const encryptedUser = security.encryptJSON(user)

      const queryString = new URLSearchParams(encryptedUser).toString()

      const link = `http://${process.env.HOST}:${process.env.FE_PORT}/recover-password?${queryString}`

      const mailOptions = {
        to: email,
        subject: 'Password Recovery',
        text: 'This is your password recovery request link',
        html: mailTemplate(link)
      }

      await mailService.sendMail(mailOptions)
      

      handleResponse(res, "Success", 200)
    } catch (error) {
      handleError(res, error)
    }
  },

  recoverPassword: async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return handleResponse(res, errors.array()[0].msg, 400);
    }

    try {
      const { iv, data } = req.query
      const { password } = req.body

      const user = security.decryptJSON(data, iv)

      const hashedPassword = await bcrypt.hash(password, 10);
      
      userModel.updateUser(user.id_user, { password: hashedPassword })
      handleResponse(res, 'Success', 200)
    } catch (error) {
      if (error.message === 'Token has expired') {
        return handleResponse(res, error.message, 400);
      }
      handleError(res, error)
    }
  }
};

module.exports = authController
