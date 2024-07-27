
const express = require('express');
const router = express.Router();
const AuthHelper = require('./helper/JWTAuthHelper');
const TryCatch = require('./helper/TryCatch');
const Messages = require('./constants/Messages');

//imports here
const studentController = require('./controllers/studentController');


//code here

//Entity - Student --start
//Authentication - Student
router.post('/register-student', new TryCatch(studentController.apiRegister).tryCatchGlobe());
router.post('/login-student', new TryCatch(studentController.apiLogin).tryCatchGlobe());

//CRUD Operations - Student
router.post('/student/does-email-exists', AuthHelper.verifyToken, new TryCatch(studentController.doesEmailExist).tryCatchGlobe());
router.get('/student/get-by-id/:id', AuthHelper.verifyToken, new TryCatch(studentController.getById).tryCatchGlobe());
router.get('/student/get-by-email/:email', AuthHelper.verifyToken, new TryCatch(studentController.getByEmail).tryCatchGlobe());
router.get('/student/get-all', AuthHelper.verifyToken, new TryCatch(studentController.getAllStudent).tryCatchGlobe());
router.delete('/student/delete-by-id/:id', AuthHelper.verifyToken, new TryCatch(studentController.deleteById).tryCatchGlobe());
//Entity - Student - End

module.exports = router;
