import express from 'express';

const router = express.Router();
router.get('/', (req, res) => {});
router.get('/login', (req, res) => {
  res.render('login', { title: '로그인 페이지' });
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
export default router;
