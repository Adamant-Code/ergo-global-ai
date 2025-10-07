import { Socket,  } from "socket.io-client";
import { create } from "zustand";

type State = {
  webSocket: Socket | null;
};

type Action = {
  setWebSocket: (ws: Socket) => void;
};

const useWebSocketStore = create<State & Action>((set) => ({
  webSocket: null,
  setWebSocket: (ws) => set({ webSocket: ws }),
}));

export default useWebSocketStore;
