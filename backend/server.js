import 'dotenv/config';
import http from 'http';
import app from './app.js';

app.set('port', process.env.PORT || 4000)
const server = http.createServer(app);

server.listen(process.env.PORT || 4000);