const reportService = require("../services/report.service");
const { success } = require("../utils/apiResponse");

async function getReports(req, res, next) {
    try {
        const data = await reportService.getReports();
        return success(res, data);
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getReports,
};