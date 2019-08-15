const { Schema, model} = require('mongoose');

/**
 * @swagger
 * definition:
 *   Developer:
 *     properties:
 *       name:
 *         type: string
 *       user:
 *         type: string
 *       bio:
 *         type: string
 *       avatar:
 *         type: string
 *       likes:
 *         type: array
 *       dislikes:
 *         type: array
 */
const DeveloperSchema = new Schema({
    name: { type: String, required: true },
    user: { type: String, required: true },
    bio: String,
    avatar: { type: String, required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: 'Developer' }],
    dislikes: [{ type: Schema.Types.ObjectId, ref: 'Developer' }]
}, {
    timestamps: true //createdAt, updatedAt
});

module.exports = model('Developer', DeveloperSchema);
