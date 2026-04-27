const Content = require('../models/Content');

const uploadContent = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Please upload a file" });
        }

        const { title, description, subject, startTime, endTime, durationMinutes } = req.body;

        const content = await Content.create({
            title,
            description,
            subject,
            fileUrl: `/uploads/${req.file.filename}`,
            fileName: req.file.originalname,
            fileType: req.file.mimetype,
            fileSize: req.file.size,
            uploadedBy: req.user._id,
            startTime,
            endTime,
            durationMinutes
        });

        res.status(201).json({
            success: true,
            message: "Content uploaded successfully",
            data: content
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const getMyContent = async (req, res) => {
    try {
        const content = await Content.find({ uploadedBy: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: content
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const getMyContentById = async (req, res) => {
    try {
        const content = await Content.findOne({ _id: req.params.id, uploadedBy: req.user._id });
        if (!content) {
            return res.status(404).json({ success: false, message: "Content not found" });
        }
        res.status(200).json({
            success: true,
            data: content
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const updateContent = async (req, res) => {
    try {
        const content = await Content.findOne({ _id: req.params.id, uploadedBy: req.user._id });
        if (!content) {
            return res.status(404).json({ success: false, message: "Content not found" });
        }
        if (content.status !== 'pending') {
            return res.status(400).json({ success: false, message: "Can only update pending content" });
        }

        const updatedData = req.body;
        if (req.file) {
            updatedData.fileUrl = `/uploads/${req.file.filename}`;
            updatedData.fileName = req.file.originalname;
            updatedData.fileType = req.file.mimetype;
            updatedData.fileSize = req.file.size;
        }

        const updatedContent = await Content.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        res.status(200).json({
            success: true,
            message: "Content updated successfully",
            data: updatedContent
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const deleteContent = async (req, res) => {
    try {
        const content = await Content.findOne({ _id: req.params.id, uploadedBy: req.user._id });
        if (!content) {
            return res.status(404).json({ success: false, message: "Content not found" });
        }
        
        await Content.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: "Content deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports = { uploadContent, getMyContent, getMyContentById, updateContent, deleteContent };
