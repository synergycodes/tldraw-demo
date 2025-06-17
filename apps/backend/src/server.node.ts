import cors from "@fastify/cors";
import websocketPlugin from "@fastify/websocket";
import fastify from "fastify";
import type { RawData } from "ws";
import { loadAsset, storeAsset } from "./assets";
import { makeOrLoadRoom } from "./rooms";
import { unfurl } from "./unfurl";

const PORT = 5858;

const app = fastify();
app.register(websocketPlugin);
app.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
});

app.register(async (app) => {
  app.get("/api/healthcheck", async () => {
    return "OK";
  });

  app.get("/api/connect/:roomId", { websocket: true }, async (socket, req) => {
    const roomId = (req.params as { roomId: string }).roomId;
    const sessionId = (req.query as { sessionId?: string })?.sessionId || "";
    const isReadonly =
      (req.query as { readOnly?: string })?.readOnly === "true" || false;
    const caughtMessages: RawData[] = [];

    const collectMessagesListener = (message: RawData) => {
      caughtMessages.push(message);
    };

    socket.on("message", collectMessagesListener);

    const room = await makeOrLoadRoom(roomId);
    room.handleSocketConnect({ sessionId, socket, isReadonly });

    socket.off("message", collectMessagesListener);

    for (const message of caughtMessages) {
      socket.emit("message", message);
    }
  });

  app.addContentTypeParser("*", (_, __, done) => done(null));
  app.put("/api/uploads/:id", {}, async (req, res) => {
    const id = (req.params as { id: string }).id;
    await storeAsset(id, req.raw);
    res.send({ ok: true });
  });
  app.get("/api/uploads/:id", async (req, res) => {
    const id = (req.params as { id: string }).id;
    const data = await loadAsset(id);
    res.send(data);
  });

  app.get("/api/unfurl", async (req, res) => {
    const url = (req.query as { url: string }).url;
    res.send(await unfurl(url));
  });
});

app.listen({ port: PORT, host: "0.0.0.0" }, (err) => {
  if (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  }

  // eslint-disable-next-line no-console
  console.log(`Server started on port ${PORT}`);
});
