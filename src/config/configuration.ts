export default () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    database: {
      host: 'pg-locations-lechanhung80.c.aivencloud.com',
      port: 16713,
      databaseName: 'locations',
      username: 'avnadmin',
      password: 'AVNS_DEyB76ERBA2gYQpVh0E'
    }
  });