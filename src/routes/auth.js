import express from 'express';
const router = express.Router();
router.get('/', (req, res) => {});
router.get('/signup/verify', (req, res) => {
    res.render('signup-verify', { title: '회원가입 페이지'});
});
export default router;
