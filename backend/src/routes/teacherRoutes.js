const express = require('express');
const { uploadContent, getMyContent, getMyContentById, updateContent, deleteContent } = require('../controllers/teacherController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const { upload } = require('../middlewares/uploadMiddleware');
const { validateRequest, schemas } = require('../middlewares/validationMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorize('teacher'));

router.post('/upload', upload.single('file'), validateRequest(schemas.uploadContentSchema), uploadContent);
router.get('/my-content', getMyContent);
router.get('/my-content/:id', getMyContentById);
router.put('/:id', upload.single('file'), updateContent);
router.delete('/:id', deleteContent);

module.exports = router;
