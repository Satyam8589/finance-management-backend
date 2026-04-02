import asyncHandler from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/response.js";
import { 
    getSummary,
    getCategoryTotals,
    getMonthlyTrends,
    getRecentActivity 
} from "./dashboard.service.js";

const getDashboardOverviewController = asyncHandler(async (req, res) => {
    const summary = await getSummary();
    const recent = await getRecentActivity();
    
    sendSuccess(res, "Dashboard overview fetched successfully", { summary, recent }, 200);
});

const getCategoryBreakdownController = asyncHandler(async (req, res) => {
    const categories = await getCategoryTotals();
    sendSuccess(res, "Category totals fetched successfully", categories, 200);
});

const getMonthlyTrendsController = asyncHandler(async (req, res) => {
    const trends = await getMonthlyTrends();
    sendSuccess(res, "Monthly trends fetched successfully", trends, 200);
});

export {
    getDashboardOverviewController,
    getCategoryBreakdownController,
    getMonthlyTrendsController
};
