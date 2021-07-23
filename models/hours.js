const mongoose = require('mongoose');

const hourSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    staffID: String,
    Days: String,
    Hours: String,
    Minutes: String,
    Seconds: String
});

module.exports = mongoose.model('Hour', hourSchema, 'hours');