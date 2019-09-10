const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const jobSchema = new Schema({
    jobId: { type: String, required: true, unique: true},
    jobQueryString: { type: String, required: true },
    jobType: { type: String, required: true },
    jobName: { type: String, required: true },
    jobStat: {
        Hp: { type: Number, required: true },
        Attack: { type: Number, required: true },
        Break: { type: Number, required: true },
        Magic: { type: Number, required: true },
        CritChance: { type: Number, required: true },
        Speed: { type: Number, required: true },
        Defense: { type: Number, required: true }
    },
    jobOrbs: Schema.Types.Mixed, // multiple orbsets
    jobMpRole: { type: String, required: true },
    jobUrlIcon: { type: String, required: true }
}, {
    timestamps: true
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;