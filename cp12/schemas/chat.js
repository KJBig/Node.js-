const mongoose = require('mongoose');

const { Schema } = mongoose;
const { Types: { ObjectId } } = Schema;
const chatSchema = new Schema({
    // 채팅방 아이디
    room: {
        type: ObjectId,
        required: true,
        ref: 'Room',
    },

    // 채팅한 사람
    user: {
        type: String,
        fig: String,
    },

    // 채팅 내역
    chat: String,

    // 이미지
    gif: String,

    // 채팅한 시간
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Chat', chatSchema);