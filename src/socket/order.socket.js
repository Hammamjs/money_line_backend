import { appEvent } from '../events/app.evemts.js';
import { EVENTS } from '../events/app.events.name.js';
import { notificationsService } from '../services/notifications.service.js';
import { getIo } from '../socket.io.js';
import { sendTelegramMessage } from '../utils/send.message.js';

export const registerOrderSocketEvent = appEvent.on(
  EVENTS.ORDER_CREATED,
  async ({ order }) => {
    const io = getIo();

    const message = `
    Thanks for your trust,\n
     Order no. ${order.orderCount} is under processing now.\n
     it may take a while 
    `;

    const adminMessage = `New order has arrived! Order number: #${order.orderCount}

• Conversion: From ${order.fromCurrency} to ${order.toCurrency}
• Received Amount: ${order.amount}
${order.note ? `• User Note: "${order.note}"` : '• User Note: None'}
• Transaction Proof: ${order.transactionProof}`;

    io.to(order.userId).emit('order.created', {
      orderCount: order.orderCount,
      status: order.status,
      message,
    });

    try {
      // we need to save notification
      await notificationsService.create({ userId: order.userId, message });
      // await sendTelegramMessage(adminMessage);
    } catch (err) {
      console.error('Failed to save the message ', err);
    }
  },
);
