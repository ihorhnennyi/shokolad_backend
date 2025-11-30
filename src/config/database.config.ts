export const databaseConfig = () => ({
  database: {
    uri: process.env.MONGO_URI as string,
    name: process.env.MONGO_DB_NAME as string,
  },
});
