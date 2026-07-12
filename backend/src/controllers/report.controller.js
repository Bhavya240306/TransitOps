const { Parser } = require("json2csv");
const reportService = require("../services/report.services");
const { success } = require("../utils/apiResponse");

async function getReports(req, res, next) {
    try {
        const data = await reportService.getReports();
        return success(res, data);
    } catch (err) {
        next(err);
    }
}

async function exportCsv(req, res, next) {
  try {
    const data = await reportService.getReports();
    const parser = new Parser({ fields: ["month", "fuelUsed"] });
    const csv = parser.parse(data.monthlyCost);
    res.header("Content-Type", "text/csv");
    res.attachment("transitops-report.csv");
    return res.send(csv);
  } catch (err) {
    next(err);
  }
}

module.exports = {
    getReports,
    exportCsv,
};