import 'dotenv/config';
import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL!,
});

redisClient.on('connect', () => {
  console.log('Redis connected');
});

redisClient.on('ready', () => {
  console.log('Redis is ready');
});

redisClient.on('reconnecting', () => {
  console.log('Reconnecting');
});

redisClient.on('error', (err) => {
  console.log('Redis error ', err);
});

redisClient.connect().catch((err) => {
  console.error('Redis connection failed:', err);
});

export default redisClient;
