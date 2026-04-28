const express = require('express');
const router = express.Router();
const multer = require('multer');
const { ensureauthenticated, ensureRole } = require('../Middlewares/Auth');
const {
    uploadContent,
    getMyContent,
    updateContent,
    deleteContent,
    getAllContent,
    getPendingContent,
    approveContent,
    rejectContent,
    getLiveContent
} = require('../Controllers/ContentController');

// Multer Setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '-' + file.originalname)
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif' || file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: fileFilter
});

// Teacher Routes
router.post('/upload', ensureauthenticated, ensureRole(['teacher']), upload.single('file'), uploadContent);
router.get('/my-content', ensureauthenticated, ensureRole(['teacher']), getMyContent);
router.put('/:id', ensureauthenticated, ensureRole(['teacher']), upload.single('file'), updateContent);
router.delete('/:id', ensureauthenticated, ensureRole(['teacher']), deleteContent);

// Principal Routes (Admin)
router.get('/admin/all', ensureauthenticated, ensureRole(['principal']), getAllContent);
router.get('/admin/pending', ensureauthenticated, ensureRole(['principal']), getPendingContent);
router.patch('/admin/:id/approve', ensureauthenticated, ensureRole(['principal']), approveContent);
router.patch('/admin/:id/reject', ensureauthenticated, ensureRole(['principal']), rejectContent);

// Public Routes
router.get('/live/:teacherId', getLiveContent);

module.exports = router;
