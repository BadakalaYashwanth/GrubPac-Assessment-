const ContentModel = require('../Models/Content');

// Teacher: Upload Content
const uploadContent = async (req, res) => {
    try {
        const { title, description, subject, startTime, endTime, durationMinutes } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ message: "File is required", success: false });
        }

        const newContent = new ContentModel({
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

        await newContent.save();
        return res.status(201).json({ message: "Content uploaded successfully", success: true, data: newContent });
    } catch (error) {
        console.error("Upload Error:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

// Teacher: Get My Content
const getMyContent = async (req, res) => {
    try {
        const contents = await ContentModel.find({ uploadedBy: req.user._id }).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: contents });
    } catch (error) {
        console.error("Get My Content Error:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

// Teacher: Update Content (only if pending)
const updateContent = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        const content = await ContentModel.findOne({ _id: id, uploadedBy: req.user._id });
        if (!content) return res.status(404).json({ message: "Content not found", success: false });
        if (content.status !== 'pending') return res.status(400).json({ message: "Can only edit pending content", success: false });

        if (req.file) {
            updates.fileUrl = `/uploads/${req.file.filename}`;
            updates.fileName = req.file.originalname;
            updates.fileType = req.file.mimetype;
            updates.fileSize = req.file.size;
        }

        Object.assign(content, updates);
        await content.save();
        
        return res.status(200).json({ message: "Content updated", success: true, data: content });
    } catch (error) {
        console.error("Update Content Error:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

// Teacher: Delete Content (only if pending)
const deleteContent = async (req, res) => {
    try {
        const { id } = req.params;
        const content = await ContentModel.findOne({ _id: id, uploadedBy: req.user._id });
        
        if (!content) return res.status(404).json({ message: "Content not found", success: false });
        if (content.status !== 'pending') return res.status(400).json({ message: "Can only delete pending content", success: false });

        await ContentModel.deleteOne({ _id: id });
        return res.status(200).json({ message: "Content deleted", success: true });
    } catch (error) {
        console.error("Delete Content Error:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

// Principal: Get All Content
const getAllContent = async (req, res) => {
    try {
        const contents = await ContentModel.find().populate('uploadedBy', 'name email').sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: contents });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

// Principal: Get Pending Content
const getPendingContent = async (req, res) => {
    try {
        const contents = await ContentModel.find({ status: 'pending' }).populate('uploadedBy', 'name email').sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: contents });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

// Principal: Approve Content
const approveContent = async (req, res) => {
    try {
        const { id } = req.params;
        const content = await ContentModel.findById(id);
        if (!content) return res.status(404).json({ message: "Content not found", success: false });

        content.status = 'approved';
        content.approvedBy = req.user._id;
        content.approvedAt = new Date();
        await content.save();

        return res.status(200).json({ message: "Content approved", success: true, data: content });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

// Principal: Reject Content
const rejectContent = async (req, res) => {
    try {
        const { id } = req.params;
        const { rejectionReason } = req.body;
        
        if (!rejectionReason) return res.status(400).json({ message: "Rejection reason required", success: false });

        const content = await ContentModel.findById(id);
        if (!content) return res.status(404).json({ message: "Content not found", success: false });

        content.status = 'rejected';
        content.rejectionReason = rejectionReason;
        await content.save();

        return res.status(200).json({ message: "Content rejected", success: true, data: content });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

// Public: Get Live Content with Rotation Logic
const getLiveContent = async (req, res) => {
    try {
        const { teacherId } = req.params;
        const { subject } = req.query;
        
        const now = new Date();
        const query = {
            status: 'approved',
            uploadedBy: teacherId,
            startTime: { $lte: now },
            endTime: { $gte: now }
        };

        if (subject) {
            query.subject = subject;
        }

        const eligibleContents = await ContentModel.find(query).sort({ createdAt: 1 });

        if (eligibleContents.length === 0) {
            return res.status(404).json({ success: false, message: "No content available" });
        }

        // Calculate rotation
        // Find total duration in minutes of all eligible content
        let totalDuration = 0;
        for (const c of eligibleContents) {
            totalDuration += c.durationMinutes;
        }

        if (totalDuration === 0) {
            return res.status(200).json({ success: true, data: eligibleContents[0] });
        }

        // Convert current time to total minutes since a fixed epoch (e.g., start of day)
        // Or simply use minutes since unix epoch for continuous rotation
        const minutesSinceEpoch = Math.floor(now.getTime() / 60000);
        
        const rotationPosition = minutesSinceEpoch % totalDuration;
        
        let currentPosition = 0;
        let activeContent = eligibleContents[0];

        for (const c of eligibleContents) {
            if (rotationPosition >= currentPosition && rotationPosition < currentPosition + c.durationMinutes) {
                activeContent = c;
                break;
            }
            currentPosition += c.durationMinutes;
        }

        return res.status(200).json({ success: true, data: activeContent });
    } catch (error) {
        console.error("Get Live Content Error:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

module.exports = {
    uploadContent,
    getMyContent,
    updateContent,
    deleteContent,
    getAllContent,
    getPendingContent,
    approveContent,
    rejectContent,
    getLiveContent
};
