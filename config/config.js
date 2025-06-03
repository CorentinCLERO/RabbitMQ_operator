const amqplib = require("amqplib");
require("dotenv").config();

const rabbitmq_url = process.env.RABBITMQ_URL;

async function config() {
  const connexion = await amqplib.connect(rabbitmq_url);

  const channel = await connexion.createChannel();

  await channel.assertExchange();
}

config();
