const amqplib = require("amqplib");
const {
  exchangeDirect,
  exchangeFanout,
  queueAdd,
  queueSub,
  queueMul,
  queueDiv,
  queueResults,
} = require("../constants/constants");
require("dotenv").config();

const rabbitmq_url = process.env.RABBITMQ_URL;

async function config() {
  let connection;
  try {
    connection = await amqplib.connect(rabbitmq_url);
    const channel = await connection.createChannel();

    // Configuration des exchanges
    await channel.assertExchange(exchangeDirect, "direct", { durable: false });
    await channel.assertExchange(exchangeFanout, "fanout", { durable: false });

    // Configuration des queues
    await channel.assertQueue(queueAdd, { durable: false });
    await channel.assertQueue(queueSub, { durable: false });
    await channel.assertQueue(queueMul, { durable: false });
    await channel.assertQueue(queueDiv, { durable: false });
    await channel.assertQueue(queueResults, { durable: false });

    // Binding des exchanges
    await channel.bindExchange(exchangeFanout, exchangeDirect, "all");

    // Binding des queues avec l'exchange direct
    await channel.bindQueue(queueAdd, exchangeDirect, "add");
    await channel.bindQueue(queueSub, exchangeDirect, "sub");
    await channel.bindQueue(queueMul, exchangeDirect, "mul");
    await channel.bindQueue(queueDiv, exchangeDirect, "div");

    // Binding des queues de résultats
    await channel.bindQueue(queueResults, queueAdd, "");
    await channel.bindQueue(queueResults, queueDiv, "");
    await channel.bindQueue(queueResults, queueSub, "");
    await channel.bindQueue(queueResults, queueMul, "");

    console.log("RabbitMQ configuration finie avec succès");

    await channel.close();
    await connection.close();
  } catch (error) {
    console.error("Erreur durant la configuration de RabbitMQ:", error);
    if (connection) {
      await connection.close();
    }
    process.exit(1);
  }
}

config();
