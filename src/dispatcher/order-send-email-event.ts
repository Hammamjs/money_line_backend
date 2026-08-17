import { appEvent } from '../events/app-events.js';
import { EVENTS } from '../events/app-events-name.js';
import { notificationsService } from '../services/notifications.service.js';
import { getIo } from '../socket-io.js';
import { sendTelegramMessage } from '../utils/send-message.js';
import { currencyRepository } from '../repository/currency.repository.js';

export const registerOrderSocketEvent = appEvent.on(
  EVENTS.ORDER_CREATED,
  async ({ order }) => {
    const io = getIo();

    const message = `
    Thanks for your trust,\n
     Order no. ${order.orderCount} is under processing now.\n
     it may take a while 
    `;

    // get from and to asset
    const [from, to] = await Promise.all([
      currencyRepository.getById(order.fromCurrencyId),
      currencyRepository.getById(order.toCurrencyId),
    ]);

    const adminMessage = `New order has arrived! Order number: #${order.orderCount}
• Conversion: From ${from?.name} to ${to?.name}
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
      await notificationsService.create({
        userId: order.userId,
        message,
        title: 'New Order has created!',
      });
      await sendTelegramMessage(adminMessage);
    } catch (err) {
      console.error('Failed to save the message ', err);
    }
  },
);
