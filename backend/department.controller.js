const Department = require("./department.model.js");

//Create new Department
exports.create = (req, res) => {

    // create Department from model schema
    var department = new Department({
        name: req.body.name
    })

    // save Department to database
    department.save().then(department => {
        res.send(department);
        console.log("Department created, id: " + department._id)
    }).catch(err => {
        console.error(err)
        res.status(500).send({
            message: "Internal Server Error"
        });
    });
   
}

//get all Departments
exports.getAllDepartments = (req, res) => {
    Department.find().then(department => {
        res.send(department);
        
    }).catch(err => {
        res.status(500).send({
            message: "Internal Server Error"
        });
    });
};

//update department by ID
exports.findOneAndUpdate = (req, res) => {
    Department.findOneAndUpdate({
        name: req.body.name,
        new : true
        }).then(department => {
        console.log('Updating by ID')
        if (!department) {
            return res.status(404).send({
                message: "Error, no Department found with id: " + req.params._id
            });
        }

        res.send("The Department has been updated: " + department);

    }).catch(err => {
        if (err.kind == "ObjectId") {
            return res.status(404).send({
                message: "Error no object found"
            });
        }
        return res.status(500).send({
            message: "Internal Error"
        })
    })
};

exports.findOneAndRemove = (req, res) => {
    Department.findOneAndRemove({
        }).then(department => {
        console.log('Removing by ID')
        if (!department) {
            return res.status(404).send({
                message: "Error, no Department found with id: " + req.params._id
            });
        }

        res.send("The Department has been removed");

    }).catch(err => {
        if (err.kind == "ObjectId") {
            return res.status(404).send({
                message: "Error no object found"
            });
        }
        return res.status(500).send({
            message: "Internal Error"
        })
    })
};

//find one department by ID
exports.findOne = (req, res) => {
    Department.findById((req.params._id)).then(department => {
        console.log('finding by ID')
        if (!department) {
            return res.status(404).send({
                message: "Error, no shift found with id: " + req.params._id
            });
        }

        res.send(department);

    }).catch(err => {
        if (err.kind == "ObjectId") {
            return res.status(404).send({
                message: "Error no object found"
            });
        }
        return res.status(500).send({
            message: "Internal Error"
        })
    })
};


