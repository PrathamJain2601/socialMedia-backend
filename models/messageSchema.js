import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  messages: {
    type: Array,
    required: true
  },
  members:{
    type: Array,
    required: true
  }
}, {timestamps: true});

export const Message = mongoose.model('Message', messageSchema);

