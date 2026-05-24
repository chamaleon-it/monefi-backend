const allowedOrigin = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://192.168.1.45:3000',
  'https://staging.bakerjonesholdings.com',
  'https://bakerjonesholdings.com',
  'https://www.bakerjonesholdings.com',
];

const origin = (origin: any, callback: any) => {
  if (!origin || allowedOrigin.includes(origin)) {
    callback(null, true);
  } else {
    callback(new Error('Not allowed by CORS'));
  }
};

export default origin;
