import socketIO from "socket.io";

const io = socketIO(5000);

io.on("connection", (socket) => {
  const id = socket.handshake.query.id;
  socket.join(id);

  socket.on(
    "send-message",
    ({ recipients, text }: { recipients: string[]; text: string }) => {
      recipients.forEach((recipient: string) => {
        const newRecipients = recipients.filter((r) => r !== recipient);
        newRecipients.push(id);
        socket.broadcast.to(recipient).emit("receive-message", {
          recipients: newRecipients,
          sender: id,
          text,
        });
      });
    }
  );
});
