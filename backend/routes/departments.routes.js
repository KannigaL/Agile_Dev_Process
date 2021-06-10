module.exports = (app) => {
    const department = require("../department.controller.js");

    // create a new department
    app.post("/api/department", department.create);
    
    // get all departments
    app.get("/api/department", department.getAllDepartments);

    // get a single department by ID
    app.get("/api/department/:_id", department.findOne);

    //update department by id
    app.put("/api/department/:_id", department.findOneAndUpdate);

    //delete department by id
    app.delete("/api/department/:_id", department.findOneAndRemove);
   
}
