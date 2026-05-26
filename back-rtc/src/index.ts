import { Elysia, t } from "elysia";

const app = new Elysia()
  .ws("/ws", {
    body: t.Object({
      target: t.String(),
      text: t.String(),
    }),

    query: t.Object({
      id: t.String(),
    }),

    open(ws) {
      const id = ws.data.query.id;
      ws.subscribe(id);
    },

    message(ws, message) {
      ws.publish(message.target, message.text);
    },
  })
  .listen(3000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
