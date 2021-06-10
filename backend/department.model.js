const mongoose = require("mongoose")
//If we keep startTime and endTime as dates, no "date" (from + to) field is needed, but will keep it in for now.
const DepartmentSchema = mongoose.Schema({
    name: String
})

module.exports = mongoose.model("Department", DepartmentSchema);