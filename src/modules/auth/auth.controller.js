import asyncHandler from "../../utils/asyncHandler.js";
import {
  registerUser,
  loginUser,
  refreshTokens,
  logoutUser,
  logoutAllDevices,
} from "./auth.service.js";
import { sendSuccess } from "../../utils/response.js";

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const data = await registerUser({ name, email, password, role });
  sendSuccess(res, "User registered successfully", data, 201);
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const data = await loginUser(email, password);
  sendSuccess(res, "Login successful", data, 200);
});

const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  const data = await refreshTokens(refreshToken);
  sendSuccess(res, "Tokens refreshed successfully", data, 200);
});

const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  await logoutUser(refreshToken);
  sendSuccess(res, "Logged out successfully", null, 200);
});

const logoutAll = asyncHandler(async (req, res) => {
  await logoutAllDevices(req.user.id);
  sendSuccess(res, "Logged out from all devices successfully", null, 200);
});

export { register, login, refresh, logout, logoutAll };
