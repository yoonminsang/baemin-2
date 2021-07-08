import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import db from '../db/index.js';

const router = express.Router();
router.get('/', (req, res) => {
  const { user } = req;
  if (user) return res.json({ user });
  return res.status(401).json('자동 로그인 실패');
});
router
  .route('/login')
  .get((req, res) => {
    res.render('login', { title: '로그인 페이지' });
  })
  .post((req, res) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.status(409).json('이메일 또는 비밀번호가 틀립니다');
      req.logIn(user, (err) => {
        if (err) return next(err);
        return res.redirect('/auth');
      });
    })(req, res, next);
  });
router.get('/signup/terms', (req, res) => {
  res.render('signup-terms', { title: '회원가입 페이지' });
});
router.get('/signup/verify', (req, res) => {
  res.render('signup-verify', { title: '회원가입 페이지' });
});
router.get('/signup/info', (req, res) => {
  res.render('signup-info', { title: '회원가입 페이지' });
});
router.post('/signup', async (req, res) => {
  console.log('signup post');
  const id = uuidv4();
  const { email, nickname, password, birth } = req.body;
  if (
    db
      .get('users')
      .find({
        email,
      })
      .value()
  )
    return res.status(409).json('이메일이 존재합니다.');
  else if (
    db
      .get('users')
      .find({
        nickname,
      })
      .value()
  )
    return res.status(409).json('닉네임이 존재합니다.');
  const hash = await bcrypt.hash(password, 10);
  db.get('user')
    .push({
      id,
      email,
      nickname,
      password: hash,
      birth,
    })
    .write();
  return res.json('회원가입 완료');
});
export default router;
