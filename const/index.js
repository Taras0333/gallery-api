const allowedOrigins = [
  'http://localhost:3000',
  process.env.BASE_ORIGIN,
  'https://localhost:3000',
  'http://localhost:8080',
  'https://localhost:8080',
  'https://networker-delta.vercel.app',
]

module.exports = { allowedOrigins }
