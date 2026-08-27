import { useNotificationStore } from "@/stores/notification.store";
import { useActivityStore } from "@/stores/activity.store";

/**
 * Real-Time WebSocket Listener for VegaRecords
 * ---------------------------------------------
 * Listens for live STOMP/WebSocket notification & activity streams.
 */

class WebSocketNotificationClient {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectTimer = null;
  }

  connect() {
    if (typeof window === "undefined") return;
    if (this.socket && this.isConnected) return;

    try {
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080/ws-notifications";
      
      // Native WebSocket connection with fallback
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        console.log("⚡ [WebSocket] Connected to VegaRecords Notification Broadcaster Stream");
        this.isConnected = true;
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.title || data.message) {
            useNotificationStore.getState().addNotification(data);
          }
          if (data.action || data.entityType) {
            useActivityStore.getState().addActivity(data);
          }
        } catch (err) {
          console.debug("[WebSocket] Text frame received:", event.data);
        }
      };

      this.socket.onclose = () => {
        this.isConnected = false;
        // Auto-reconnect polling every 10s
        this.scheduleReconnect();
      };

      this.socket.onerror = (err) => {
        console.debug("WebSocket connection fallback active");
        this.isConnected = false;
      };
    } catch (e) {
      console.debug("WebSocket setup note:", e);
    }
  }

  scheduleReconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, 10000);
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.isConnected = false;
    }
  }
}

export const wsClient = new WebSocketNotificationClient();
