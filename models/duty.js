const mongoose = require('mongoose');

const dutySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    staffID: String,
    startTime: String,
});

module.exports = mongoose.model('Duty', dutySchema, 'dutys');