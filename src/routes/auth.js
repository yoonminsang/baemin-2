import express from 'express';
const router = express.Router();
router.get('/', (req, res) => {});
router.get('/login', (req, res) => {
  res.render('login', { title: '로그인 페이지' });
});
export default router;
