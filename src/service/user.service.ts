import mysql, { OkPacket, RowDataPacket } from 'mysql2/promise';
import { Request, Response } from 'express';
import { connectionConfig } from '../config';

// 모든 User 정보 가져오는 API
const userAll = async (_req: Request, res: Response): Promise<void> => {
  try {
    const connection = await mysql.createConnection(connectionConfig); // DB 연결 메소드 (config를 통해)
    const [result] = await connection.execute<RowDataPacket[]>('SELECT * FROM user');
    // const result = await connection.execute<RowDataPacket[]>('SELECT * FROM user'); // 메타데이터 그대로 가져옴

    connection.end(); // 끝나면 DB 연결을 끊는다(be 연결X)
    res.status(200).send(result);
    // res.json(result); // result -> json 형태로 변환, res로 나감
  } catch (error) {
    res.status(500).json(error); // 코드500
    // res.status(500).json('원하는 메세지'); // 객체, 배열 가능
  }
};

// 특정 User 검색하는 API
const userFind = async (req: Request, res: Response): Promise<void> => {
  // req 쓰려면 언더바 지우기
  const { userid } = req.query;
  try {
    const connection = await mysql.createConnection(connectionConfig);
    const [result] = await connection.execute<RowDataPacket[]>(
      'SELECT * FROM user WHERE  userid=?',
      [userid]
      // 'SELECT * FROM user WHERE  userid= ? AND name= ?',[userid, name] // 물음표 순서대로 들어감
    );
    connection.end();

    // 응답 로직 추가
    // if(result.length<0){
    // }

    res.status(200).send(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

// 유저 생성하는 API
const userCreate = async (req: Request, res: Response): Promise<void> => {
  const { userid, password, name, age, tf } = req.body;

  try {
    const connection = await mysql.createConnection(connectionConfig);
    const [result] = await connection.execute<OkPacket>(
      'INSERT INTO user (userid, password, name, age, tf) VALUES (?,?,?,?,?)',
      [userid, password, name, age, tf]
    );
    connection.end();

    if (result.affectedRows >= 1) {
      res.status(201).send({ message: '정상적으로 추가되었습니다.' });
    } else {
      res.status(201).send({ message: '실패하였습니다.' });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// 유저 삭제하는 API
const userDelete = async (req: Request, res: Response): Promise<void> => {
  const { userid } = req.query;
  try {
    const connection = await mysql.createConnection(connectionConfig);
    const [result] = await connection.execute<OkPacket>('DELETE FROM user WHERE userid=?', [
      userid,
    ]);
    connection.end();

    if (result.affectedRows >= 1) {
      res.status(201).send({ message: '정상적으로 삭제되었습니다.' });
    } else {
      res.status(201).send({ message: '실패하였습니다.' });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// 유저 수정하는 API
const userModify = async (req: Request, res: Response): Promise<void> => {
  const { userid } = req.query;
  let { password, name, age, tf } = req.body;

  try {
    const connection = await mysql.createConnection(connectionConfig);

    // 해당 아이디 조회 후 기존 값 넣기
    const [find] = await connection.execute<RowDataPacket[]>(
      'SELECT * from user WHERE userid = ?',
      [userid]
    );
    if (find.length > 0) {
      if (!password) {
        password = find[0].password;
      }
      if (!name) {
        name = find[0].name;
      }
      if (!age) {
        age = find[0].age;
      }
      if (!tf) {
        tf = find[0].tf;
      }
    }

    // 업데이트 쿼리 진행
    const [result] = await connection.execute<OkPacket>(
      'UPDATE user SET password = ?, name = ?, age = ?, tf =?, mod_date = ? WHERE userid = ?',
      [password, name, age, tf, new Date(), userid]
    );
    connection.end();

    if (result.affectedRows >= 1) {
      res.status(201).send({ message: '정상적으로 수정되었습니다.' });
    } else {
      res.status(201).send({ message: '실패하였습니다.' });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// 로그인 API
const userLogin = async (req: Request, res: Response): Promise<void> => {
  const { userid, password } = req.body;
  console.log('1111', userid, password);
  try {
    const connection = await mysql.createConnection(connectionConfig);
    const [result] = await connection.execute<RowDataPacket[]>(
      'SELECT * FROM user WHERE userid=? and password=?',
      [userid, password]
    );
    connection.end();

    console.log(`result`, result);
    if (result.length >= 1 && result[0].password === password) {
      res.status(201).send({ message: 'success' });
    } else {
      res.status(201).send({ message: '아이디 또는 비밀번호가 일치하지 않습니다.' });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export default { userAll, userFind, userCreate, userDelete, userModify, userLogin };
