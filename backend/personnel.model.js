const mongoose = require("mongoose");

const PersonnelSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    /**
    //Include if we want to have a two-way relation between shifts and personnel, currently shifts holds personel only.
    ,
    AssignedTo: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shift'
    }]
    **/
})

module.exports = mongoose.model("Personnel", PersonnelSchema);