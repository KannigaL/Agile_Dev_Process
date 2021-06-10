
module.exports = (app) => {
    const shift = require("../shift.controller.js");


    // create a new shift
    app.post("/api/shifts", shift.create);
    
    // get all shifts
    app.get("/api/shifts", shift.getAllShifts);

    // get a single shift by ID
    app.get("/api/shifts/:_id", shift.findOne);

    // get a shifts by date
    app.get("/api/shifts/date/:date", shift.findByDate);

    // get all shifts by week
    app.get("/api/shifts/week/:date", shift.findByWeek);

    //update shift by id
    app.put("/api/shifts/", shift.findOneAndUpdate);

    //delete shift by id
    app.delete("/api/shifts/:_id", shift.findOneAndRemove);

    //get no. of assigned personnel and no. of hours by month
    app.get("/api/shifts/stats/:date", shift.findPersonnelStatsByMonth);

    //get sick personnel from today -> forward
    app.get("/api/sick", shift.findSickPersonnel);

    app.post("/api/sick/", shift.markSick);

}
