import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import db from '../db/index.js';
import passport from 'passport';

const router = express.Router();
router
  .route('/login')
  .get((req, res) => {
    const user = req.user;
    if (user) res.redirect('/');
    res.render('login', { title: '로그인 페이지' });
  })
  .post((req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.status(409).json('이메일 또는 비밀번호가 틀립니다');
      req.logIn(user, (err) => {
        if (err) return next(err);
        res.json('로그인 성공');
      });
    })(req, res, next);
  });
router.get('/signup/terms', (req, res) => {
  const user = req.user;
  if (user) res.redirect('/');
  res.render('signup-terms', { title: '회원가입 페이지' });
});
router.get('/signup/verify', (req, res) => {
  const user = req.user;
  if (user) res.redirect('/');
  res.render('signup-verify', { title: '회원가입 페이지' });
});
router.get('/signup/info', (req, res) => {
  const user = req.user;
  if (user) res.redirect('/');
  res.render('signup-info', { title: '회원가입 페이지' });
});
router.post('/signup', async (req, res) => {
  const id = uuidv4();
  const { email, nickname, password, birth } = req.body;
  if (
    // db
    //   .get('users')
    //   .find({
    //     email,
    //   })
    //   .value()
    db.where(['email'], [email]).snapshot.length
  )
    return res.status(409).json('이메일이 존재합니다.');
  else if (
    // db
    //   .get('users')
    //   .find({
    //     nickname,
    //   })
    //   .value()
    db.where(['nickname'], [nickname]).snapshot.length
  )
    return res.status(409).json('닉네임이 존재합니다.');
  const hash = await bcrypt.hash(password, 10);
  // db.get('users')
  //   .push({
  //     id,
  //     email,
  //     nickname,
  //     password: hash,
  //     birth,
  //   })
  //   .write();
  db.insert({
    id,
    email,
    nickname,
    password: hash,
    birth,
  });
  return res.json('회원가입 완료');
});
router.get('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.json('로그아웃');
});
router.post('/check', (req, res) => {
  const { email } = req.body;
  if (
    // db
    //   .get('users')
    //   .find({
    //     email,
    //   })
    //   .value()
    db.where(['email'], [email]).snapshot.length
  )
    return res.status(409).json('이메일이 존재합니다');
  return res.json('사용할 수 있는 이메일입니다');
});
export default router;
