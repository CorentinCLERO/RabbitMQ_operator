require("dotenv").config();

const amqplib = require("amqplib");
const { exchangeDirect } = require("../constants/constants.js");

const rabbitmqUrl = process.env.RABBITMQ_URL;

const args = process.argv.slice(2);
const routingKey = args[0] || "mul";

function generateMessage() {
  const n1 = Math.floor(Math.random() * 100);
  const n2 = Math.floor(Math.random() * 100);
  return JSON.stringify({ n1, n2, op: routingKey });
}

async function send(msg, key) {
  try {
    const conn = await amqplib.connect(rabbitmqUrl);
    const channel = await conn.createChannel();

    await channel.assertExchange(exchangeDirect, "direct", { durable: false });

    channel.publish(exchangeDirect, key, Buffer.from(msg));
    console.log(
      `[✓] Message envoyé avec clé '${key}' sur l'échange '${exchangeDirect}' direct`,
      msg
    );

    setTimeout(() => {
      conn.close();
      process.exit(0);
    }, 500);
  } catch (error) {
    console.error("Erreur lors de l’envoi du message:", error);
    process.exit(1);
  }
}

const message = generateMessage();
send(message, routingKey);
