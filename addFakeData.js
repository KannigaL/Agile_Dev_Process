// Change this when using vs-code extension
db = new Mongo().getDB("plannersApp")

// Create department
db.departments.drop();
db.departments.insertMany([
  { '_id': ObjectId("000000000000000000000000"), 'name': 'Roller coaster 1'},
  { '_id': ObjectId("000000000000000000000001"), 'name': 'Roller coaster 2'},
  { '_id': ObjectId("000000000000000000000002"), 'name': 'Roller coaster 3'},
  { '_id': ObjectId("000000000000000000000003"), 'name': 'Food 1'},
  { '_id': ObjectId("000000000000000000000004"), 'name': 'Food 2'},
  { '_id': ObjectId("000000000000000000000005"), 'name': 'Food 3'},
  { '_id': ObjectId("000000000000000000000006"), 'name': 'Play ground 1'},
  { '_id': ObjectId("000000000000000000000007"), 'name': 'Play ground 2'},
  { '_id': ObjectId("000000000000000000000008"), 'name': 'Play ground 3'},
]);

// Create personnel
db.personnels.drop();
db.personnels.insertMany([
  { '_id': ObjectId("010000000000000000000001"), 'firstName': 'Joel', 'lastName' : 'Sandberg'},
  { '_id': ObjectId("010000000000000000000002"), 'firstName': 'Lelle', 'lastName' : 'Einarsson'},
  { '_id': ObjectId("010000000000000000000003"), 'firstName': 'Harald', 'lastName' : 'Sörensson'},
  { '_id': ObjectId("010000000000000000000004"), 'firstName': 'Jon', 'lastName' : 'Patriksson'},
  { '_id': ObjectId("010000000000000000000005"), 'firstName': 'Johannes', 'lastName' : 'Grahn'},
  { '_id': ObjectId("010000000000000000000006"), 'firstName': 'Ulrica', 'lastName' : 'Sandberg'},
  { '_id': ObjectId("010000000000000000000007"), 'firstName': 'Jessica', 'lastName' : 'Einarsson'},
  { '_id': ObjectId("010000000000000000000008"), 'firstName': 'Kamilla', 'lastName' : 'Sörensson'},
  { '_id': ObjectId("010000000000000000000009"), 'firstName': 'Regina', 'lastName' : 'Patriksson'},
  { '_id': ObjectId("010000000000000000000010"), 'firstName': 'Hanna', 'lastName' : 'Grahn'},
  { '_id': ObjectId("010000000000000000000011"), 'firstName': 'Maria', 'lastName' : 'Andersson'},
  { '_id': ObjectId("010000000000000000000012"), 'firstName': 'Erik', 'lastName' : 'Johansson'},
  { '_id': ObjectId("010000000000000000000013"), 'firstName': 'Anna', 'lastName' : 'Karlsson'},
  { '_id': ObjectId("010000000000000000000014"), 'firstName': 'Lars', 'lastName' : 'Nilsson'},
  { '_id': ObjectId("010000000000000000000015"), 'firstName': 'Margareta', 'lastName' : 'Eriksson'},
  { '_id': ObjectId("010000000000000000000016"), 'firstName': 'Karl', 'lastName' : 'Larsson'},
  { '_id': ObjectId("010000000000000000000017"), 'firstName': 'Elisabeth', 'lastName' : 'Olsson'},
  { '_id': ObjectId("010000000000000000000018"), 'firstName': 'Anders', 'lastName' : 'Persson'},
  { '_id': ObjectId("010000000000000000000019"), 'firstName': 'Eva', 'lastName' : 'Svensson'},
  { '_id': ObjectId("010000000000000000000020"), 'firstName': 'Johan', 'lastName' : 'Gustafsson'},
  { '_id': ObjectId("010000000000000000000021"), 'firstName': 'Kristina', 'lastName' : 'Pettersson'},
  { '_id': ObjectId("010000000000000000000022"), 'firstName': 'Per', 'lastName' : 'Jonsson'},
  { '_id': ObjectId("010000000000000000000023"), 'firstName': 'Birgitta', 'lastName' : 'Jansson'},
  { '_id': ObjectId("010000000000000000000024"), 'firstName': 'Nils', 'lastName' : 'Hansson'},
  { '_id': ObjectId("010000000000000000000025"), 'firstName': 'Karin', 'lastName' : 'Bengtsson'},
  { '_id': ObjectId("010000000000000000000026"), 'firstName': 'Carl', 'lastName' : 'Carlsson'},
  { '_id': ObjectId("010000000000000000000027"), 'firstName': 'Marie', 'lastName' : 'Lundqvist'},
  { '_id': ObjectId("010000000000000000000028"), 'firstName': 'Mikael', 'lastName' : 'Lindberg'},
  { '_id': ObjectId("010000000000000000000029"), 'firstName': 'Elisabet', 'lastName' : 'Petersson'},
  { '_id': ObjectId("010000000000000000000030"), 'firstName': 'Jan', 'lastName' : 'Magnusson'},
]);

db.shifts.drop();
var date = new Date('2021-01-01')
for(i = 0; i < 365; i++) {
  db.personnels.find().forEach( function(myDoc) { 
    var staffId = myDoc._id.toString() // object id of staff
    var dep_n = Math.floor(Math.random() * 9) // random department
    var workTime = Math.floor(Math.random() * 8) + 1 // 1-8 hour shift
    var startTime = Math.floor(Math.random() * (14 - workTime)) + 8 // start time
    var random = Math.random() // random for: emergancy and not working (add sick?)
    var from = new Date(date.getTime()) //formatting date
    from.setHours(startTime, 0, 0, 0) //formatting date
    var to = new Date(date.getTime()) //formatting date
    to.setHours(startTime + workTime, 0, 0, 0) //formatting date

    // 0 - 0.1 = sick, 0.1 - 0.8 = normal, 0.8 - 1 = not working
    if (random < 0.1){
      db.shifts.insertOne({
        'startDate' : from,
        'endDate' : to,
        'department' : {"type" : ObjectId("00000000000000000000000" + dep_n)},
        'isEmergency' : true,
        'assigned' : {"type" : ObjectId(staffId)},
      });
    } else if (random < 0.8) {
      db.shifts.insertOne({
        'startDate' : from,
        'endDate' : to,
        'department' : {"type" : ObjectId("00000000000000000000000" + dep_n)},
        'isEmergency' : false,
        'assigned' : {"type" : ObjectId(staffId)},
      });
    }
  });

  // increment by one day
  date = new Date(date.getTime() + (1000 * 60 * 60 * 24))
}

var from = new Date('2021-05-18')
from.setHours(0, 0, 0, 0) //formatting date
var to = new Date('2021-05-30')
to.setHours(0, 0, 0, 0) //formatting date

db.shifts.updateMany(
  {
    $and: [
      {startDate: {$gte: from}},
      {startDate: {$lt: to}},
      {"assigned.type": ObjectId("010000000000000000000030")}
    ]
  },
  {
    $set: {
      isSick: true
    }
  }
)