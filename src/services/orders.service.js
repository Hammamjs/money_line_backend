import { Errors } from '../errors/map.errors.js';
import { ordersRepository } from '../repository/orders.repository.js';
import { ORDER_STATUS } from '../constant/order.status.js';
import { uploadTransactionProof } from '../utils/upload.transaction.proof.js';
import { validateImage } from '../utils/validate.image.js';
import { safeRemoveImage } from '../utils/safe.remove.image.js';
import { appEvent } from '../events/app.evemts.js';
import { EVENTS } from '../events/app.events.name.js';
import { exchangeRateRepository } from '../repository/exchange-rate.repoitory.js';

const TRANSACTION_PROOF_BUCKET = process.env.BUCKET_NAME;

if (!TRANSACTION_PROOF_BUCKET) {
  throw new Error('BUCKET_NAME is required');
}

export const ordersService = {
  create: async ({
    userId,
    phone,
    accountHolderName,
    paymentProvider,
    mimetype,
    buffer,
    fromAssetId,
    toAssetId,
    note,
    amount,
  }) => {
    if (!userId) throw Errors.badRequest('Order must belong to user');

    const requiredFields = {
      accountHolderName,
      paymentProvider,
      phone,
      buffer,
      mimetype,
      amount,
    };

    const missing = Object.entries(requiredFields)
      .filter(([_, v]) => v === undefined)
      .map(([key]) => key);

    if (missing.length > 0)
      throw Errors.badRequest(`Missing fields: ${missing.join(', ')}`);

    // we need to check assestId
    if (!fromAssetId || !toAssetId)
      throw Errors.badRequest('assets are required');

    const currecyPair = await exchangeRateRepository.getByCurrencyPair(
      fromAssetId,
      toAssetId,
    );

    if (!currecyPair) throw Errors.notFound('Currencies not found');

    const fromCurrency = currecyPair.fromCurrency.name;
    const toCurrency = currecyPair.toCurrency.name;

    // validate image
    validateImage({ buffer, mimetype });

    let transactionProofImg;

    try {
      transactionProofImg = await uploadTransactionProof(buffer);

      const order = await ordersRepository.create({
        userId,
        phone,
        accountHolderName,
        paymentProvider,
        transactionProof: transactionProofImg,
        fromCurrency,
        toCurrency,
        note,
        amount,
      });

      if (!order) throw Errors.internal('Failed to create order');

      // Event driven
      appEvent.emit(EVENTS.ORDER_CREATED, {
        order,
      });

      return order;
    } catch (err) {
      await safeRemoveImage(transactionProofImg);

      throw err;
    }
  },

  update: async (
    id,
    { phone, accountHolderName, paymentProvider, mimetype, buffer },
  ) => {
    if (!id) throw Errors.badRequest('Id is required');

    const oldOrder = await ordersRepository.getById(id);

    if (!oldOrder) throw Errors.notFound('Order not found');

    const hasNewImage = Boolean(buffer || mimetype);

    if (hasNewImage && (!buffer || !mimetype))
      throw Errors.badRequest('Both mimetype and image file are required');

    const data = {
      phone,
      accountHolderName,
      paymentProvider,
    };

    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined),
    );

    if (Object.keys(filteredData).length === 0 && !hasNewImage)
      throw Errors.badRequest('Nothing to update');

    let newImage;

    try {
      if (hasNewImage) {
        // validate image
        validateImage({ buffer, mimetype });

        newImage = await uploadTransactionProof(buffer);
        filteredData.transactionProof = newImage;
      }

      const updatedOrder = await ordersRepository.update(id, filteredData);

      if (!updatedOrder) throw Errors.internal('Failed to update order');

      // remove old image
      if (newImage && oldOrder.transactionProof) {
        await safeRemoveImage(oldOrder.transactionProof);
      }

      return updatedOrder;
    } catch (err) {
      await safeRemoveImage(newImage);
      throw err;
    }
  },

  updateStatus: async (id, { status } = {}) => {
    if (status && !ORDER_STATUS.includes(status))
      throw Errors.badRequest('Invalid status');

    const order = await ordersRepository.updateStatus(id, { status });

    if (!order) throw Errors.notFound('Order not found');

    return order;
  },

  getAll: async ({ status } = {}) => {
    if (status && !ORDER_STATUS.includes(status))
      throw Errors.badRequest('Invalid order status');

    return ordersRepository.getAll({ status });
  },

  getById: async ({ id }) => {
    if (!id) throw Errors.badRequest('Id is required');
    const order = await ordersRepository.getById(id);
    if (!order) throw Errors.notFound('Order with this id not found');
    return order;
  },

  getByUserId: async ({ userId }) => {
    if (!userId) throw Errors.badRequest('User id is required');
    return ordersRepository.getByUserId(userId);
  },

  delete: async ({ id }) => {
    if (!id) throw Errors.badRequest('id is required');

    const order = await ordersRepository.getById(id);

    if (!order) throw Errors.notFound('Order not found');

    const deletedOrder = await ordersRepository.delete(id);

    if (!deletedOrder) throw Errors.internal('Failed to delete the order');

    await safeRemoveImage(order.transactionProof);

    return deletedOrder;
  },
};
