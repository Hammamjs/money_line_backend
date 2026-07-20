import 'dotenv/config';
import axios from 'axios';

const BOT_TOKEN = process.env.BOT_TOKEN;
const GROUP_CHAT_ID = process.env.GROUP_CHAT_ID;

export async function sendTelegramMessage(message) {
  try {
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      chat_id: GROUP_CHAT_ID,
      text: message,
    });
  } catch (error) {
    console.error('Telegram error:', error.response?.data || error.message);
  }
}
