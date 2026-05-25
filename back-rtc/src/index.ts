import { Elysia, t } from "elysia";

const app = new Elysia()
  .ws("/ws", {
    body: t.Object({
      target: t.String(),
      data: t.String(),
    }),

    query: t.Object({
      id: t.String(),
    }),

    open(ws) {
      const id = ws.data.query.id;
      ws.subscribe(id);
    },

    message(ws, message) {
      const { id } = ws.data.query;
      ws.publish(message.target, {
        id,
        text: message.data,
        time: Date.now(),
      });
    },
  })
  .listen(3000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
