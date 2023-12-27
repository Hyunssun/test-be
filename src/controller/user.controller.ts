import express from 'express';
import userService from '../service/user.service';

const router = express.Router();

// router.get('/', userService.userAll); // /user
router.get('/all', userService.userAll);
router.post('/find', userService.userFind);
router.post('/create', userService.userCreate);
router.delete('/delete', userService.userDelete);
router.patch('/modify', userService.userModify);

router.post('/login', userService.userLogin);

export default router;
