import { Response } from 'express';

export const connectionConfig = {
  host: '127.0.0.1',
  user: 'root',
  password: '1234',
  database: 'test',
  port: 3306,
  charset: 'utf8',
};

export const ResponseMessage = {
  require: (res: Response) => {
    res.status(400).send({ success: false, message: '400 Bad Request' });
  },
  duplicate: (res: Response) => {
    res.status(409).send({ success: false, message: '409 Conflict' });
  },
  invalid: (res: Response) => {
    res.status(422).send({ success: false, message: '422 Unprocessable Entity' });
  },
  mismatch: (res: Response) => {
    res.status(409).send({ success: false, message: '409 Conflict' });
  },
  queryfail: (res: Response) => {
    res.status(500).send({ success: false, message: '500 Internal Server Error' });
  },
  success: (res: Response, result?: any) => {
    res.send({ success: true, result });
  },
  error: (res: Response, error: any) => {
    const message = error instanceof Error ? error.message : '500 Internal Server Error';
    res.status(500).send({ success: false, message });
  },
};
