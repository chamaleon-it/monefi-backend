const allowedOrigin = [
  'http://localhost:3000',
  'http://localhost:3001',
  "http://65.0.91.139:3000"
  
];

const origin = (origin: any, callback: any) => {
  if (!origin || allowedOrigin.includes(origin)) {
  callback(null, true);
  } else {
  callback(new Error('Not allowed by CORS'));
  }
};

export default origin