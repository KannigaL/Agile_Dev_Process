const mongoose = require("mongoose")
//If we keep startTime and endTime as dates, no "date" (from + to) field is needed, but will keep it in for now.
const ShiftSchema = mongoose.Schema({
    startDate: Date,
    endDate: Date,
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department'
    },
    isEmergency: Boolean,
    isSick: Boolean,
    assigned: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Personnel'
    }
})

module.exports = mongoose.model("Shift", ShiftSchema);