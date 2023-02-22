const express = require('express');
const router = express.Router();
const admin = require('../controller/admin_auth');
const middileware = require('../helper/middleware')

router.post('/register',admin.register);
router.post('/login',admin.login);
router.post('/update_user',admin.update_user);
router.get('/getallusers',middileware.routing_checker,admin.getallusers);

module.exports = router;