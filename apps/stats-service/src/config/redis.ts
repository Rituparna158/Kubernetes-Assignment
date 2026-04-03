import Redis from 'ioredis';

console.log('Connecting to Redis at:', process.env.REDIS_HOST);

export const connection = new Redis(
  process.env.REDIS_HOST || 'redis://redis:6379',
);

connection.on('connect', () => {
  console.log(' Redis connected');
});

connection.on('error', (err) => {
  console.error(' Redis error:', err);
});
