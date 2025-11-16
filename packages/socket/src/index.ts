import PusherServer from "pusher";
import PusherClient from "pusher-js";

/**
 * ## Pusher Server
 * @description The server-side Pusher web socket allowing two-way communication
 */
export const pusherServer = new PusherServer({
  appId: process.env.NEXT_PUBLIC_PUSHER_APP!,
  key: "6570ad20d22c8000331c",
  secret: process.env.PUSHER_SECRET!,
  cluster: "eu",
  useTLS: true,
});

/**
 * ## Pusher Client
 * @description The client-side Pusher web socket allowing two-way communication
 */
export const pusherClient = new PusherClient("6570ad20d22c8000331c", {
  cluster: "eu",
  authEndpoint: "/api/auth/pusher",
  authTransport: "ajax",
  auth: { headers: { "Content-Type": "application/json" } },
});
