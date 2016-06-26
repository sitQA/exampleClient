'use strict';
var situationConsumer = require('./situationConsumer');
var simulationDataConsumer = require('./simulationDataConsumer');
var MongoClient = require('mongodb').MongoClient;

var insertSituation = function(db, situation, callback) {
    var collection = db.collection('situations');
    collection.insertOne(situation);
};


var start = function(callback) {

    var url = 'mongodb://localhost:27017/situationLog';
    MongoClient.connect(url, function(err, db) {

        situationConsumer.listen(callback, msg => {
            console.log("received situation");
            var situation = JSON.parse(msg.content);
            situation.type = 'detected';
            delete situation['children'];
            insertSituation(db, situation);
        });

        simulationDataConsumer.listen(null, msg => {
            console.log("received simulation event");
            var event = JSON.parse(msg.content);
            var sitOccured = {
                id: 'truckInTraffic',
                role: event.eventType,
                quality: 1,
                type: 'real',
                objectId: event.truckId,
                meta: {timeDetected: event.ts, strategy: 'model'}
            };
            insertSituation(db, sitOccured);
        });
    });


};

module.exports = {
    start: start
};