var convict = require('convict');

// Define a schema
var conf = convict({
    env: {
        doc: "The applicaton environment.",
        format: ["production", "development", "test"],
        default: "development",
        env: "NODE_ENV"
    },
    amqp: {
        url: {
            doc: "The amqp connection URL for the AMQP broker to use.",
            format: String,
            default: "amqp://localhost",
            env: "AMQP_URL"
        },
        simulationQueue: {
            doc: "name of the amqp queue where truck events are published",
            format: String,
            default: "simulation",
            env: "AMQP_SIM_QUEUE"
        },
        situationExchange: {
            doc: "name of the amqp exchange where situations with quality annotations should be published (pub/sub style)",
            format: String,
            default: "situations",
            env: "AMQP_SIT_EXCHANGE"
        },
        routingKey: {
            doc: "name of the amqp exchange where situations with quality annotations should be published (pub/sub style)",
            format: String,
            default: "truckInTraffic",
            env: "AMQP_SIT_ROUTING_KEY"
        }
    }
});

// Load environment dependent configuration
var env = conf.get('env');
try {
    conf.loadFile('./config/' + env + '.json');
} catch(e) {
    // no config file present, will use defaults
}


// Perform validation
conf.validate({strict: true});

module.exports = conf;
