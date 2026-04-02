import asyncHandler from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/response.js";
import { 
  getAllUsers, 
  getUserById, 
  updateUserRole, 
  updateUserStatus, 
  deleteUser 
} from "./users.service.js";

const getAllUsersController = asyncHandler(async (req, res) => {
  const { role } = req.query;
  const users = await getAllUsers(role);
  sendSuccess(res, "Users fetched successfully", users, 200);
});

const getUserByIdController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await getUserById(id);
  sendSuccess(res, "User fetched successfully", user, 200);
});

const updateUserRoleController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  const user = await updateUserRole(id, role);
  sendSuccess(res, "User role updated successfully", user, 200);
});

const updateUserStatusController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const user = await updateUserStatus(id, status);
  sendSuccess(res, "User status updated successfully", user, 200);
});

const deleteUserController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await deleteUser(id);
  sendSuccess(res, "User deleted successfully", null, 200);
});

export { 
  getAllUsersController, 
  getUserByIdController, 
  updateUserRoleController, 
  updateUserStatusController,
  deleteUserController 
};