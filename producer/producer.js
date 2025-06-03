require("dotenv").config();

const amqplib = require('amqplib');
const { exchangeDirect, exchangeFanout } = require('../constants/constants.js');

const rabbitmqUrl = process.env.RABBITMQ_URL;

const args = process.argv.slice(2);
const routingKey = args[0] || 'add';
const exchangeTypeArg = args[1] || 'direct';
const exchange = (exchangeTypeArg === 'fanout') ? exchangeFanout : exchangeDirect;

function generateMessage() {
    const n1 = Math.floor(Math.random() * 100);
    const n2 = Math.floor(Math.random() * 100);
    return JSON.stringify({ n1, n2, op: routingKey });
}

async function send(msg, key) {
    try {
        const conn = await amqplib.connect(rabbitmqUrl);
        const channel = await conn.createChannel();

        const type = (exchange === exchangeDirect) ? 'direct' : 'fanout';

        await channel.assertExchange(exchange, type, { durable: false });

        channel.publish(exchange, key, Buffer.from(msg));
        console.log(`[✓] Message envoyé avec clé '${key}' sur l'échange '${exchange}' (${type}) :`, msg);

        setTimeout(() => {
            conn.close();
            process.exit(0);
        }, 500);
    } catch (error) {
        console.error('Erreur lors de l’envoi du message:', error);
        process.exit(1);
    }
}

const message = generateMessage();
send(message, routingKey);
