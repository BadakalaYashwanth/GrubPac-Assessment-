const Content = require('../models/Content');

const getAllContent = async (req, res) => {
    try {
        const content = await Content.find().populate('uploadedBy', 'name email');
        res.status(200).json({ success: true, data: content });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const getPendingContent = async (req, res) => {
    try {
        const content = await Content.find({ status: 'pending' }).populate('uploadedBy', 'name email');
        res.status(200).json({ success: true, data: content });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const approveContent = async (req, res) => {
    try {
        const content = await Content.findById(req.params.id);
        if (!content) {
            return res.status(404).json({ success: false, message: "Content not found" });
        }
        
        const existingApproved = await Content.countDocuments({
            uploadedBy: content.uploadedBy,
            subject: content.subject,
            status: 'approved'
        });

        content.status = 'approved';
        content.approvedBy = req.user._id;
        content.approvedAt = Date.now();
        content.rotationOrder = existingApproved;
        await content.save();

        res.status(200).json({
            success: true,
            message: "Content approved",
            data: content
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const rejectContent = async (req, res) => {
    try {
        const { rejectionReason } = req.body;
        const content = await Content.findById(req.params.id);
        
        if (!content) {
            return res.status(404).json({ success: false, message: "Content not found" });
        }

        content.status = 'rejected';
        content.rejectionReason = rejectionReason;
        await content.save();

        res.status(200).json({
             success: true,
             message: "Content rejected",
             data: content
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports = { getAllContent, getPendingContent, approveContent, rejectContent };
