const express = require('express');
const router = express.Router();


router.get('/', async (req, res, next) =>{
  res.render('main', { title: '채팅방' });
});


module.exports = router;
