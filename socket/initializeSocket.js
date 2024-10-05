import { Message } from "../models/messageSchema.js";

export const initializeSocket = (io) => {
  return io.on('connection', (socket) => {
    // console.log('New user connected:', socket.id);

    socket.on('joinRoom', async ({ userId1, userId2 }, callback) => {
      try {
        // console.log("Joining room with users:", userId1, userId2);
        const res = await Message.findOne({ members: { $all: [userId1, userId2] } });
        if (res) {
          socket.join(res._id.toString());
          // console.log(`User ${socket.id} joined room ${res._id}`);
          callback({ roomId: res._id.toString() }, res.messages);
        } else {
          const res2 = await Message.create({
            members: [userId1, userId2]
          });
          socket.join(res2._id.toString());
          // console.log(`User ${socket.id} joined room ${res2._id}`);
          callback({ roomId: res2._id.toString() }, []);
        }
      } catch (error) {
        console.log("Error joining room:", error);
      }
    });

    socket.on('sendMessage', async ({ roomId, message, sender }, callback) => {
      try {
        const newMessage = { message, sender };
        // console.log("Sending message:", newMessage, "to room:", roomId);
        const updatedRoom = await Message.findOneAndUpdate(
          { _id: roomId },
          { $push: { messages: newMessage } },
          { new: true }
        );
        socket.to(roomId).emit('newMessage', newMessage);
        callback(newMessage);
        // console.log("Message sent and emitted:", newMessage);
      } catch (error) {
        console.log("Error sending message:", error);
      }
    });

    socket.on('disconnect', () => {
      // console.log('User disconnected:', socket.id);
    });
  });
}
