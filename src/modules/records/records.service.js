import prisma from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";

const recordSelect = {
  id: true,
  amount: true,
  type: true,
  category: true,
  date: true,
  notes: true,
  createdAt: true,
  updatedAt: true,
};

const createRecord = async (userId, data) => {
  return await prisma.record.create({
    data: { ...data, userId },
    select: recordSelect,
  });
};

const getAllRecords = async (filters = {}) => {
  const { userId, type, category, startDate, endDate, page = 1, limit = 10 } = filters;

  const where = { isDeleted: false };

  if (userId) where.userId = userId;
  if (type) where.type = type;
  if (category) where.category = { contains: category, mode: 'insensitive' };
  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = new Date(startDate);
    if (endDate) where.date.lte = new Date(endDate);
  }

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const [records, total] = await Promise.all([
    prisma.record.findMany({
      where,
      select: recordSelect,
      orderBy: { date: 'desc' },
      skip,
      take: limitNum,
    }),
    prisma.record.count({ where }),
  ]);

  return {
    data: records,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
  };
};

const getRecordById = async (id) => {
  const record = await prisma.record.findFirst({
    where: { id, isDeleted: false },
    select: recordSelect,
  });

  if (!record) {
    throw new AppError("No record found with that ID.", 404);
  }

  return record;
};

const updateRecord = async (id, data) => {
  const record = await prisma.record.findFirst({ where: { id, isDeleted: false } });
  if (!record) {
    throw new AppError("No record found with that ID.", 404);
  }

  return await prisma.record.update({
    where: { id },
    data,
    select: recordSelect,
  });
};

const deleteRecord = async (id) => {
  const record = await prisma.record.findFirst({ where: { id, isDeleted: false } });
  if (!record) {
    throw new AppError("No record found with that ID.", 404);
  }

  await prisma.record.update({
    where: { id },
    data: { isDeleted: true },
  });

  return null;
};

export { createRecord, getAllRecords, getRecordById, updateRecord, deleteRecord };
