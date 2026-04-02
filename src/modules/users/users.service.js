import prisma from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  status: true,
  createdAt: true,
};

const getAllUsers = async (role) => {
  const where = role ? { role } : {};
  
  const users = await prisma.user.findMany({
    where,
    select: userSelect,
    orderBy: { createdAt: 'desc' }
  });

  return users;
};

const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: userSelect,
  });

  if (!user) {
    throw new AppError("No user found with that ID.", 404);
  }

  return user;
};

const updateUserRole = async (id, role) => {
  const checkUser = await prisma.user.findUnique({ where: { id } });
  if (!checkUser) {
    throw new AppError("No user found with that ID.", 404);
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: { role },
    select: userSelect,
  });

  return updatedUser;
};

const updateUserStatus = async (id, status) => {
  const checkUser = await prisma.user.findUnique({ where: { id } });
  if (!checkUser) {
    throw new AppError("No user found with that ID.", 404);
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: { status },
    select: userSelect,
  });

  return updatedUser;
};

const deleteUser = async (id) => {
  const checkUser = await prisma.user.findUnique({ where: { id } });
  if (!checkUser) {
    throw new AppError("No user found with that ID.", 404);
  }

  await prisma.user.delete({
    where: { id },
  });

  return null;
};

export { 
  getAllUsers, 
  getUserById, 
  updateUserRole, 
  updateUserStatus, 
  deleteUser 
};
