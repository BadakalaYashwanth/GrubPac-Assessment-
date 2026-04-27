const Content = require('../models/Content');

const getLiveContent = async (req, res) => {
    try {
        const { teacherId } = req.params;
        const { subject } = req.query;

        const now = new Date();

        const query = {
            uploadedBy: teacherId,
            status: 'approved',
            startTime: { $lte: now },
            endTime: { $gte: now },
        };

        if (subject) {
            query.subject = subject;
        }

        const activeContents = await Content.find(query).sort({ rotationOrder: 1 });

        if (activeContents.length === 0) {
            return res.status(200).json({ message: "No content available" });
        }

        let totalDuration = 0;
        activeContents.forEach(c => {
            totalDuration += c.durationMinutes;
        });

        const currentMinutes = Math.floor(now.getTime() / (1000 * 60));
        const cyclePosition = currentMinutes % totalDuration;

        let activeIndex = 0;
        let cumulativeDuration = 0;

        for (let i = 0; i < activeContents.length; i++) {
            cumulativeDuration += activeContents[i].durationMinutes;
            if (cyclePosition < cumulativeDuration) {
                activeIndex = i;
                break;
            }
        }

        const currentActiveContent = activeContents[activeIndex];

        res.status(200).json({
            success: true,
            data: currentActiveContent
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports = { getLiveContent };
