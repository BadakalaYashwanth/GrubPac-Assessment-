const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ContentSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    subject: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileName: { type: String, required: true },
    fileType: { type: String, required: true },
    fileSize: { type: Number, required: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    rejectionReason: { type: String },
    approvedBy: { type: Schema.Types.ObjectId, ref: 'users' },
    approvedAt: { type: Date },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    durationMinutes: { type: Number, required: true },
    rotationOrder: { type: Number, default: 0 },
}, { timestamps: true });

const ContentModel = mongoose.model('contents', ContentSchema);
module.exports = ContentModel;
