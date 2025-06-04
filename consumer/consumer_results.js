require("dotenv").config();
const { io } = require("socket.io-client");

const amqp = require("amqplib");
const { queueResults } = require("../constants/constants");

const RABBITMQ_URL = process.env.RABBITMQ_URL;

const socket = io("http://localhost:3000");

async function resultConsumer() {
  const connection = await amqp.connect(RABBITMQ_URL);

  const channel = await connection.createChannel();

  await channel.assertQueue(queueResults, { durable: false });

  console.log(`En attente des résultats sur la queue '${queueResults}'...\n`);

  channel.consume(
    queueResults,
    (msg) => {
      if (msg !== null) {
        handleResultMessage(channel, msg);
      }
    },
    { noAck: false }
  );
}

function handleResultMessage(channel, msg) {
  try {
    const result = JSON.parse(msg.content.toString());

    console.log("Résultat reçu :");
    console.log(JSON.stringify(result, null, 2));

    socket.emit("resultValue", result);

    console.log("Événement 'calculationResult' émis :", result);

    channel.ack(msg);
  } catch (err) {
    console.error("Erreur lors du parsing du message :", err);
    channel.nack(msg, false, false);
  }
}

resultConsumer().catch((err) => {
  console.error("Erreur dans le consumer_result :", err);
});
