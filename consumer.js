amqp.connect('amqp://localhost', function(err, conn) {
    conn.createChannel(function(err, ch) {
        var ex = 'topic_logs';

        ch.assertExchange(ex, 'topic', {durable: false});

        ch.assertQueue('', {exclusive: true}, function(err, q) {
            console.log(' [*] Waiting for logs. To exit press CTRL+C');

            args.forEach(function(key) {
                ch.bindQueue(q.queue, ex, key);
            });

            ch.consume(q.queue, function(msg) {
                console.log(" [x] %s:'%s'", msg.fields.routingKey, msg.content.toString());
            }, {noAck: true});
        });
    });
});