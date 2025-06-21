export default () => ({
  port: parseInt(process.env.PORT as string, 10) || 3001,
  database_url: process.env.DATABASE_URL as string,
  secret: {
    accessToken: 'dsfsfsgsag',
    refreshToken: 'fafhablrebglebku',
  },
});
