import asyncHandler from "../../utils/asyncHandler.js"
import { sendSuccess } from "../../utils/response.js";
import { createRecord, getAllRecords, getRecordById, updateRecord, deleteRecord } from "./records.service.js";

const createRecordController = asyncHandler(async (req, res) => {
    const {amount, type, category, date, notes} = req.body;
    const record = await createRecord(req.user.id, {amount, type, category, date, notes});
    sendSuccess(res, "Record created successfully", record, 201);
});
    
const getAllRecordsController = asyncHandler(async (req, res) => {
  const { type, category, startDate, endDate } = req.query;

  const filters = { type, category, startDate, endDate };

  if (req.user.role === 'viewer') {
    filters.userId = req.user.id;
  }

  const records = await getAllRecords(filters);
  sendSuccess(res, "Records fetched successfully", records, 200);
});


const getRecordByIdController = asyncHandler(async (req, res) => {
    const record = await getRecordById(req.params.id);
    sendSuccess(res, "Record fetched successfully", record, 200);
});

const updateRecordController = asyncHandler(async (req, res) => {
    const {amount, type, category, date, notes} = req.body;
    const record = await updateRecord(req.params.id, {amount, type, category, date, notes});
    sendSuccess(res, "Record updated successfully", record, 200);
});

const deleteRecordController = asyncHandler(async (req, res) => {
    await deleteRecord(req.params.id);
    sendSuccess(res, "Record deleted successfully", null, 200);
});

export { createRecordController, getAllRecordsController, getRecordByIdController, updateRecordController, deleteRecordController };
