import React, { useContext, useEffect, useState } from "react";
import io from "socket.io-client";

/**
 * @internal
 */
const SocketContext = React.createContext<SocketIOClient.Socket | undefined>(
  undefined
);

export function useSocket() {
  return useContext(SocketContext);
}

export const SocketProvider: React.FC<React.PropsWithChildren<{
  id: string;
}>> = ({ id, children }) => {
  const [socket, setSocket] = useState<SocketIOClient.Socket>();

  useEffect(() => {
    const newSocket = io("http://localhost:5000", { query: { id } });
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [id]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
