
module.exports = (app) => {
    const personnel = require("../personnel.controller.js");

    // create a new personnel
    app.post("/api/personnel", personnel.create);
    
    // get all personnels
    app.get("/api/personnel", personnel.getAllPersonnel);

    // get a single personnel by ID
    app.get("/api/personnel/:_id", personnel.findOne);

    //update personnel by id
    app.put("/api/personnel/:_id", personnel.findOneAndUpdate);

    //delete personnel by id
    app.delete("/api/personnel/:_id", personnel.findOneAndRemove);
   
}
