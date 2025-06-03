require("dotenv").config();

const amqplib = require("amqplib");
const { exchangeDirect } = require("../constants/constants.js");

const rabbitmqUrl = process.env.RABBITMQ_URL;

const operations = ["add", "sub", "mul", "div", "all"];

function generateMessage(op) {
  const n1 = Math.floor(Math.random() * 100);
  const n2 = Math.floor(Math.random() * 100);
  return JSON.stringify({ n1, n2, op });
}

function getRandomOperation() {
  return operations[Math.floor(Math.random() * operations.length)];
}

function getRandomInterval() {
  return Math.floor(Math.random() * 4000) + 1000;
}

async function send() {
  try {
    const conn = await amqplib.connect(rabbitmqUrl);
    const channel = await conn.createChannel();

    await channel.assertExchange(exchangeDirect, "direct", { durable: false });

    const publishRandomMessage = () => {
      const op = getRandomOperation();
      const message = generateMessage(op);
      channel.publish(exchangeDirect, op, Buffer.from(message));
      console.log(
        `[✓] Message envoyé avec clé '${op}' sur l'échange '${exchangeDirect}'`
      );
      setTimeout(publishRandomMessage, getRandomInterval());
    };

    publishRandomMessage();
  } catch (error) {
    console.error("Erreur lors de l’envoi du message:", error);
    process.exit(1);
  }
}

send();
