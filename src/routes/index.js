import express from 'express';
const router = express.Router();
router.get('/', (req, res) => {
  const user = req.user || null;
  res.render('main', { title: '메인화면', user });
});
export default router;
