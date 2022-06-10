import gokv from "https://deno.land/x/gokv@0.0.12/mod.ts";

gokv.config({ token: "0h0l3e392d722v1v0e6u3g615g1m61405m6y51304l1a5r5e" });

export default async function handler(req: Request): Promise<Response> {

  const url = new URL(req.url);

  try {
    const session = await gokv.Session<{ username: string }>(req, {
      namespace: "xxx",
    });
    switch (url.pathname) {
      case "/login":
        const form = await req.formData();
        const username = form.get("username");
        const password = form.get("password");
        if (checkPassword(username, password)) {
          await session.update({ username });
          return new Response(null, {
            status: 302,
            headers: { "location": "/", "set-cookie": session.cookie },
          });
        }
        return new Response("Invalid username or password", { status: 400 });
      case "/logout":
        await session.end();
        return new Response(null, {
          status: 302,
          headers: { "location": "/", "set-cookie": session.cookie },
        });
      default:
        if (session.store) {
          return new Response(`Logined as ${session.store.username}`);
        }
        return new Response("Please login");
    }
  } catch (e) {
    return new Response(e.message, { status: 500 });
  }
}

