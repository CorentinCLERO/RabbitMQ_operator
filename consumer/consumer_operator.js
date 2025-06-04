const amqplib = require("amqplib");
require("dotenv").config();
const queueAdd = require("../constants/constants").queueAdd;
const queueSub = require("../constants/constants").queueSub;
const queueMul = require("../constants/constants").queueMul;
const queueDiv = require("../constants/constants").queueDiv;
const queueResults = require("../constants/constants").queueResults;

const rabbitmq_url = process.env.RABBITMQ_URL;

const args = process.argv.slice(2);
const keyOperator = args[0];
const ArrayOfOperators = ["add", "sub", "mul", "div"];
if (!ArrayOfOperators.includes(keyOperator)) {
  console.error(
    "Invalid operator. Please use one of the following: add, sub, mul, add"
  );
  process.exit(1);
}

const queueOperator = (() => {
  switch (keyOperator) {
    case "add":
      return queueAdd;
    case "sub":
      return queueSub;
    case "mul":
      return queueMul;
    case "div":
      return queueDiv;
    default:
      throw new Error("Invalid operator");
  }
})();

async function receive() {
  try {
    // Connexion à RabbitMQ
    const conn = await amqplib.connect(rabbitmq_url);

    // Créer un channel (connexion logique à RabbitMQ)
    channel = await conn.createChannel();

    // Vérifier que la queue operator existe (la créer sinon)
    await channel.assertQueue(queueOperator, { durable: false });

    // vérifier que la queue results existe (la créer sinon)
    await channel.assertQueue(queueResults, { durable: false });

    channel.consume(queueOperator, consume, { noAck: true });
  } catch (error) {
    console.error("Error in receive function:", error);
    process.exit(1);
  }
}

async function consume(msg) {
  try {
    if (msg !== null) {
      console.log(
        `Received message from ${queueOperator}:`,
        msg.content.toString()
      );
      const data = JSON.parse(msg.content.toString());
      console.log("Parsed data:", data);
      const { n1, n2 } = data;

      let result;
      switch (keyOperator) {
        case "add":
          result = n1 + n2;
          break;
        case "sub":
          result = n1 - n2;
          break;
        case "mul":
          result = n1 * n2;
          break;
        case "div":
          if (n2 === 0) {
            throw new Error("Division by zero is not allowed.");
          }
          result = n1 / n2;
          break;
      }

      console.log(`Result of ${n1} ${keyOperator} ${n2} = ${result}`);

      setTimeout(() => {
        const response = {
          operator: keyOperator,
          n1,
          n2,
          result,
        };
        channel.sendToQueue(
          queueResults,
          Buffer.from(JSON.stringify(response))
        );
        console.log("sent to queueResults:", response);
      }, Math.floor(Math.random() * 10000) + 5000);
    }
  } catch (error) {
    console.error("Error in consume function:", error);
  }
}

receive();
