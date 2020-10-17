import socketIO from "socket.io";

const io = socketIO(5000);

io.on("connection", (socket) => {
  const id = socket.handshake.query.id;
  socket.join(id);

  console.log("Received connection from:", id);

  socket.on(
    "send-message",
    ({ recipients, text }: { recipients: string[]; text: string }) => {
      if (recipients[0] === "all") {
        const messageInfo = {
          sender: id,
          text,
          recipients: ["all"],
        };

        socket.broadcast.emit("receive-message", messageInfo);

        return;
      }

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
