import {createClient} from 'redis';

const client = createClient({
    username: 'default',
    password: 'yS3MqKdUu1wJGGAkQocHdhepSPSgaSTi',//process.env.REDIS_PASSWORD,
    socket: {
        host: 'redis-16483.c124.us-central1-1.gce.redns.redis-cloud.com',//process.env.REDIS_HOST,
        port: 16483,//process.env.REDIS_PORT,
    }
});

client.on('error', err => console.log('Redis Client Error', err));
client.on('connect',() => console.log("Connected to Redis"));

const connectRedis = async() => {
  try{
    await client.connect();
  }catch(err){
    console.log(err);
  }
}

connectRedis();

const cacheService = {
  client,
  async get(key) {
    try {
      const value = await client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  },

  async set(key, value, expiry = 86400) {
    try {
      await client.setEx(key, expiry, JSON.stringify(value));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }
};

export default cacheService;