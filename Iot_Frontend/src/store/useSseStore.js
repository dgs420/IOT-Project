// @ts-nocheck
import { create } from "zustand";
import { EventSourcePolyfill } from "event-source-polyfill";

const useSSEStore = create((set, get) => ({
  eventSource: null,
  events: [],
  connect: (token) => {
    if (get().eventSource) return;

    const source = new EventSourcePolyfill(
      `${import.meta.env.VITE_BASE_URL}/api/sse/device-notifications`,
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }
    );

    source.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("SSE message:", data);

      set((state) => ({
        events: [data, ...state.events.slice(0, 99)],
      }));
    };

    source.onerror = (err) => {
      console.error("SSE error:", err);
    };

    set({ eventSource: source });
  },
  disconnect: () => {
    const source = get().eventSource;
    if (source) {
      source.close();
      set({ eventSource: null });
    }
  },

  getActivityLogs: () => {
    return get().events
      .filter((e) => e.type === "ACTIVITY_LOG")
      .map((e) => e.payload);
  },
}));

export default useSSEStore;
