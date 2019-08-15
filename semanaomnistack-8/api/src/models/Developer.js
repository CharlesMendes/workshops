const { Schema, model} = require('mongoose');

const DeveloperSchema = new Schema({
    name: { type: String, required: true },
    user: { type: String, required: true },
    bio: String,
    avatar: { type: String, required: true }
}, {
    timestamps: true //createdAt, updatedAt
});

module.exports = model('Developer', DeveloperSchema);
