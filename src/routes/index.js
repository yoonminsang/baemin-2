import express from 'express';
const router = express.Router();
router.get('/', (req, res) => {
  res.render('main', { title: '메인화면' });
});
export default router;
