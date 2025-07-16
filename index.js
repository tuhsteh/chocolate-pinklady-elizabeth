const https = require('https');
const app = require('./src/app');
const server = https.createServer(app);

const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
