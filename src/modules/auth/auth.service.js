import prisma from "../../lib/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import AppError from "../../utils/AppError.js";

const selectUserFields = {
  id: true,
  name: true,
  email: true,
  role: true,
  status: true,
  createdAt: true,
};

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const signAccessToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "15m" });

const createRefreshToken = async (userId) => {
  const rawToken = crypto.randomBytes(40).toString("hex");
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await prisma.refreshToken.create({
    data: { userId, tokenHash, expiresAt },
  });

  return rawToken;
};

const registerUser = async (userData) => {
  const { name, email, password, role } = userData;

  const userExists = await prisma.user.findUnique({ where: { email } });
  if (userExists) {
    throw new AppError("A user with this email already exists.", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: { name, email, password: hashedPassword, role },
    select: selectUserFields,
  });

  const accessToken = signAccessToken(newUser.id);
  const refreshToken = await createRefreshToken(newUser.id);

  return { user: newUser, accessToken, refreshToken };
};

const loginUser = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError("Invalid email or password.", 401);
  }

  if (user.status !== "active") {
    throw new AppError(
      "Your account is currently inactive. Please contact support.",
      403
    );
  }

  const accessToken = signAccessToken(user.id);
  const refreshToken = await createRefreshToken(user.id);

  const { password: _, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, accessToken, refreshToken };
};


const refreshTokens = async (rawToken) => {
  if (!rawToken) {
    throw new AppError("Refresh token is required.", 400);
  }

  const tokenHash = hashToken(rawToken);

  const stored = await prisma.refreshToken.findUnique({
    where: { tokenHash },
    include: { user: { select: { ...selectUserFields, status: true } } },
  });

  if (!stored) {
    throw new AppError("Invalid refresh token.", 401);
  }

  if (stored.expiresAt < new Date()) {
    await prisma.refreshToken.delete({ where: { tokenHash } });
    throw new AppError("Refresh token has expired. Please log in again.", 401);
  }

  if (stored.user.status !== "active") {
    throw new AppError("Account is inactive. Please contact support.", 403);
  }


  await prisma.refreshToken.delete({ where: { tokenHash } });

  const newAccessToken = signAccessToken(stored.user.id);
  const newRefreshToken = await createRefreshToken(stored.user.id);

  return {
    user: stored.user,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

const logoutUser = async (rawToken) => {
  if (!rawToken) return;

  const tokenHash = hashToken(rawToken);
  await prisma.refreshToken.deleteMany({ where: { tokenHash } });
};

const logoutAllDevices = async (userId) => {
  await prisma.refreshToken.deleteMany({ where: { userId } });
};

export {
  registerUser,
  loginUser,
  refreshTokens,
  logoutUser,
  logoutAllDevices,
};
