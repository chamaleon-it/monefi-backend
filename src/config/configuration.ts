export default () => ({
  port: parseInt(process.env.PORT as string, 10) || 3001,
  database_url: process.env.DATABASE_URL as string,
  secret: {
    accessToken: 'dsfsfsgsag',
    refreshToken: 'fafhablrebglebku',
  },
  zepto: {
    url: process.env.ZEPTO_URL as string,
    token: process.env.ZEPTO_TOKEN as string,
  },
});
