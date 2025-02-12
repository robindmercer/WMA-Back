const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController.js');
const auth = require('../auth.js');

router.get('/:id',auth.authenticate, UserController.getUserById);
router.get('/',auth.authenticate, UserController.getAllUsers);
router.put('/:id',auth.authenticate, UserController.updateUser);
router.post('/:id/perfiles',auth.authenticate, UserController.addPerfilesUsers);
router.delete('/:id',auth.authenticate, UserController.deleteUser);

module.exports = router;
