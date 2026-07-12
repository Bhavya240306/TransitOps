const dashboardService = require("../services/dashboard.service");
const { success } = require("../utils/apiResponse");

async function getDashboard(req, res, next) {
    try {
        const data = await dashboardService.getDashboard();
        return success(res, data);
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getDashboard,
};