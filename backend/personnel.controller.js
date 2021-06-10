const Personnel = require("./personnel.model.js");

//Create new Personnel
exports.create = (req, res) => {

    // create Personnel from model schema
    var personnel = new Personnel({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    })

    // save Personnel to database
    personnel.save().then(personnel => {
        res.send(personnel);
        console.log("Personnel created, id: " + personnel._id)
    }).catch(err => {
        console.error(err)
        res.status(500).send({
            message: "Internal Server Error"
        });
    });
   
}

//get all Personnels
exports.getAllPersonnel = (req, res) => {
    Personnel.find().then(personnel => {
        res.send(personnel);
        
    }).catch(err => {
        res.status(500).send({
            message: "Internal Server Error"
        });
    });
};

//update personnel by ID
exports.findOneAndUpdate = (req, res) => {
    Personnel.findOneAndUpdate({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        new : true
        }).then(personnel => {
        console.log('Updating by ID')
        if (!personnel) {
            return res.status(404).send({
                message: "Error, no Personnel found with id: " + req.params._id
            });
        }

        res.send("The Personnel has been updated: " + personnel);

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
    Personnel.findOneAndRemove({
        }).then(personnel => {
        console.log('Removing by ID')
        if (!personnel) {
            return res.status(404).send({
                message: "Error, no Personnel found with id: " + req.params._id
            });
        }

        res.send("The Personnel has been removed");

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

//find one personnel by ID
exports.findOne = (req, res) => {
    Personnel.findById((req.params._id)).then(personnel => {
        console.log('finding by ID')
        if (!personnel) {
            return res.status(404).send({
                message: "Error, no shift found with id: " + req.params._id
            });
        }

        res.send(personnel);

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


