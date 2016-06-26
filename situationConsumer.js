'use strict';
var amqp = require('amqplib/callback_api');
var conf = require('./conf');


/**
 *
 * @param onConnect callback to be invoked when the connection has been established
 * @param onMsgReceived callback to be invoked with a msg object when a message has been received
 */
let listen = function(onConnect, onMsgReceived) {
    amqp.connect(conf.get('amqp.url'), function(err, conn) {
        onConnect();

        conn.createChannel(function(err, ch) {
            
            var exchange = conf.get('amqp.situationExchange');
            var key = conf.get('amqp.routingKey');

            ch.assertExchange(exchange, 'direct', {durable: false});

            ch.assertQueue('', {exclusive: true, durable: false}, function(err, q) {

                ch.bindQueue(q.queue, exchange, key);
                ch.consume(q.queue, msg => {
                    onMsgReceived(msg);
                    ch.ack(msg);
                }, {noAck: false});

            });

        });

    });
};

module.exports = {
    listen: listen
};

