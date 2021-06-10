const Shift = require("./shift.model.js");
const tmp = require("./department.model.js");
const tmp2 = require("./personnel.model.js");
const fs = require('fs');
const app = require("./app.js");
var express = require('express');
var router = express.Router();

var ObjectId = require('mongoose').Types.ObjectId; 

//Create new shift
exports.create = (req, res) => {

    // create shift from model schema
    var shift = new Shift({
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        department: req.body.department, 
        assigned : req.body.assigned, 
        isSick: req.body.isSick || false,
        isEmergency : req.body.isEmergency || false
    })

    //Check if there is conflict in personell time
    var from = new Date(req.body.startDate).setHours(7, 0, 0, 0)
    var to = new Date(req.body.endDate).setHours(23, 0, 0, 0)

    Shift.find({
        $and: [
        {startDate: {$gte: from}},
        {endDate: {$lt: to}}
        ]
    }).populate('department').populate('assigned').then(data => {
        //check shift interference 
        if (data) {
            for(var i = 0; i < data.length; i++){
                if (JSON.stringify(data[i].assigned._id) === JSON.stringify(shift.assigned._id)){
                    //check for start and end time to identify interference
                    var saved_shift_from = new Date(data[i].startDate)
                    var saved_shift_to = new Date(data[i].endDate)
                    var new_shift_from = new Date(shift.startDate)
                    var new_shift_to = new Date(shift.endDate)

                    if (new_shift_from < saved_shift_to && new_shift_to > saved_shift_from){
                        console.log("Shift Intereference Found")
                        return res.status(418).send({
                            message: "Error, personnel shift conflict"
                        });
                    }
                }
            }
        }
        
        // save shift to database
        shift.save().then(shift => {
            res.send(shift);
            console.log("shift created, id: " + shift._id)
        }).catch(err => {
            console.error(err)
            res.status(500).send({
                message: "Internal Server Error"
            });
        });

    }).catch(err => {
        console.error(err)
        if (err.status == 418) {
            return res.status(418).send({
                message: "Error, personnel shift conflict"
            });
        }
        return res.status(500).send({
            message: "Internal Server Error"
        })
    })
   
} 

//get all shifts
exports.getAllShifts = (req, res) => {
    Shift.find().then(shift => {
        res.send(shift);
        
    }).catch(err => {
        res.status(500).send({
            message: "Internal Server Error"
        });
    });
};

//find one shift by ID
exports.findOne = (req, res) => {
    Shift.findById((req.params._id)).then(shift => {
        console.log('finding by ID')
        if (!shift) {
            return res.status(404).send({
                message: "Error, no shift found with id: " + req.params._id
            });
        }

        res.send(shift);

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

//find one shift by date
exports.findByDate = (req, res) => {
    // 7-23 should work since we only allow times between 8-22
    var from = new Date(req.params.date).setHours(7, 0, 0, 0)
    var to = new Date(req.params.date).setHours(23, 0, 0, 0)
    Shift.find({
            $and: [
            {startDate: {$gte: from}},
            {startDate: {$lt: to}}
            ]
        }).populate('department').populate('assigned').then(date => {
        if (!date) {
            return res.status(404).send({
                message: "Error, no shift found with date: " + req.params.date
            });
        }

        res.send(date);

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

//find all shifts by week
exports.findByWeek = (req, res) => {
      function getMonday(d) {
        d = new Date(d);
        var day = d.getDay(),
          diff = d.getDate() - day + (day == 0 ? -6 : 0);
        return new Date(d.setDate(diff));
      }
      function getSunday(d) {
        d = new Date(d);
        var day = d.getDay(),
          diff = d.getDate() - day + (day == 0 ? -6 : 7);
        return new Date(d.setDate(diff));
      }

      var currentMonday = getMonday(req.params.date);   
      var currentSunday = getSunday(req.params.date);

    Shift.find({
            $and: [
            {startDate: {$gte: currentMonday}},
            {startDate: {$lt: currentSunday}}
            ]
        }).populate('department').populate('assigned').then(date => {
        if (!date) {
            return res.status(404).send({
                message: "Error, no shift found with date: " + req.params.date
            });
        }

        res.send(date);

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

exports.findOneAndUpdate = (req, res) => {
    console.log(req.body)
    filter = {_id:req.body._id}
    updates = {
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        department: req.body.department,
        assigned : req.body.assigned, //add personell here
        isEmergency : req.body.isEmergency,
        isSick : req.body.isSick
        }

    //Check if there is conflict in personell time
    var from = new Date(req.body.startDate).setHours(7, 0, 0, 0)
    var to = new Date(req.body.endDate).setHours(23, 0, 0, 0)

    Shift.find({
        $and: [
        {startDate: {$gte: from}},
        {endDate: {$lt: to}}
        ]
    }).populate('department').populate('assigned').then(data => {
        //check shift interference 
        if (data) {
            for(var i = 0; i < data.length; i++){
                //check if personnel id matches but skip the current shift id
                if (JSON.stringify(data[i].assigned._id) === JSON.stringify(updates.assigned) && (JSON.stringify(data[i]._id) != JSON.stringify(req.body._id))){
                    //check for start and end time to identify interference
                    var saved_shift_from = new Date(data[i].startDate)
                    var saved_shift_to = new Date(data[i].endDate)
                    var new_shift_from = new Date(updates.startDate)
                    var new_shift_to = new Date(updates.endDate)

                    if (new_shift_from < saved_shift_to && new_shift_to > saved_shift_from){
                        console.log("Shift Intereference Found")
                        return res.status(418).send({
                            message: "Error, personnel shift conflict"
                        });
                    }
                }
            }
        }
        
        Shift.findOneAndUpdate(filter, updates).then(shift => {
            console.log('Updating by ID')
            if (!shift) {
                return res.status(404).send({
                    message: "Error, no shift found with id: " + req.body._id
                });
            }
            console.log(shift)
            res.send("The shift has been updated" );
    
        }).catch(err => {
            console.log(err)
            if (err.kind == "ObjectId") {
                return res.status(404).send({
                    message: "Error no object found"
                });
            }
            return res.status(500).send({
                message: "Internal Error" + err
            })
        })

    }).catch(err => {
        console.error(err)
        if (err.status == 418) {
            return res.status(418).send({
                message: "Error, personnel shift conflict"
            });
        }
        return res.status(500).send({
            message: "Internal Server Error"
        })
    })
}

exports.findOneAndRemove = (req, res) => {
    var query = {
        _id : req.params._id
    }
    Shift.findOneAndDelete(query, function (err, doc) {
      if (err) {
        console.log("Error:" + err);
      }
      else {
        res.send("Shift has been removed");
      }
    });
};

//get stats by month (send a date in that month)
exports.findPersonnelStatsByMonth = (req, res) => {
    var from = new Date(req.params.date)
    from.setDate(1)
    var to = new Date(from.getFullYear(), from.getMonth() + 1, 1)

    Shift.aggregate([
        {
            $match : { 
              startDate: { $gte: from, $lt: to } ,
              isSick: false
            }
        },
        {
          $group : {
            _id : { 
              $dateToString: { 
                format: "%Y-%m-%d", 
                date: "$startDate" 
              } 
            },
            assignedNormal: { 
              $sum: { 
                $cond : ["$isEmergency", 0, 1]
              } 
            },
            assignedEmergency: { 
              $sum: { 
                $cond : ["$isEmergency", 1, 0]
              } 
            },
            hoursNormal: { 
              $sum: { 
                $cond : ["$isEmergency", 0, { $subtract : [{ $hour: "$endDate" }, { $hour: "$startDate" }]}]
              }
            },
            hoursEmergency: { 
              $sum: { 
                $cond : ["$isEmergency", { $subtract : [{ $hour: "$endDate" }, { $hour: "$startDate" }]}, 0]
              }
            }
          }
        },
        {
          $sort : { _id: 1 }
        }
       ]).then(date => {
        if (!date) {
            return res.status(404).send({
                message: "Error, no shift found with date: " + req.params.date
            });
        }

        res.send(date);

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


//get sick personnel from today -> forward
exports.findSickPersonnel = (req, res) => {
    var date = new Date()
    date.setHours(0, 0, 0, 0)
    Shift.aggregate([  
        {
            $match : { 
                $and : [
                    {isSick : true},
                    {startDate : {$gte : date}}
                ]
            }
        },
        {
            $lookup: {
                from: "personnels",
                localField: "assigned.type",
                foreignField: "_id",
                as: "staff"
            }
        },
        {
            $unwind : "$staff"
        },
        {
            $group : {
                _id : "$staff._id",
                firstName: { $first : "$staff.firstName" },
                lastName: { $first : "$staff.lastName" },
                lastSickDay: {$last : "$endDate"}
            }
        },
        {
          $sort : { lastSickDay: 1 }
        }
    ]).then(data => {
        res.send(data);
    }).catch(err => {
        return res.status(500).send({
            message: "Internal Error"
        })
    })
};

exports.markSick = (req, res) => {
    Shift.updateMany(
        {
          $and: [
            {startDate: {$gte: req.body.startDate}},
            {startDate: {$lt: req.body.endDate}},
            {"assigned.type": new ObjectId(req.body.id)}
          ]
        },
        {
          $set: {
            isSick: req.body.isSick
          }
        }
      ).then(shift => {
        res.send(req.body.id + " marked as sick");

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


