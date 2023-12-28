import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import userController from './controller/user.controller';
import bodyParser from 'body-parser';

const app = express(); // app 대상으로 express 주입
app.use(cors()); // CORS 에러 방지
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(bodyParser.json({ limit: '10mb' })); // {limit} 없으면 무한대

// logs
const logDirectory = path.join(__dirname, 'logs');
if (!fs.existsSync(logDirectory)) fs.mkdirSync(logDirectory);
let today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
const logFilePath = path.join(logDirectory, `${today}.log`);
let accessLogStream = fs.createWriteStream(logFilePath, { flags: 'a' });
setInterval(() => {
  const newToday = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  if (today !== newToday) {
    today = newToday;
    accessLogStream.end(() => {
      const newLogFilePath = path.join(logDirectory, `${today}.log`);
      accessLogStream = fs.createWriteStream(newLogFilePath, { flags: 'a' });
    });
  }
}, 24 * 60 * 60 * 1000);

// routes
app.use('/user', userController);

// server
app.listen(3010, () => {
  console.log('------------ Server is running successfully ------------');
});
