const express = require('express');
const { getAllContent, getPendingContent, approveContent, rejectContent } = require('../controllers/principalController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const { validateRequest, schemas } = require('../middlewares/validationMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorize('principal'));

router.get('/all', getAllContent);
router.get('/pending', getPendingContent);
router.patch('/:id/approve', validateRequest(schemas.approveRejectSchema), approveContent);
router.patch('/:id/reject', validateRequest(schemas.approveRejectSchema), rejectContent);

module.exports = router;
