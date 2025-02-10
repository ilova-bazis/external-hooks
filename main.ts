import {
  fetchLatestTelegramUpdate,
  handleTelegramWebHook,
} from "./handlers/telegram.ts";
import {
  fetchLatestWhatsAppUpdate,
  handleWhatsAppWebHook,
} from "./handlers/whatsapp.ts";
import {
  facebookWebhookHandler,
  fetchLatestFacebookUpdate,
  handleFacebookRedirect,
} from "./handlers/facebook.ts";

async function handler(req: Request): Promise<Response> {
  console.log("Incoming request", req.method, req.url);

  const WHATSAPP_WEBHOOK = new URLPattern({ pathname: "/api/whatsapp" });
  const TELEGRAM_WEBHOOK = new URLPattern({ pathname: "/api/telegram/*" });
  const FACEBOOK_WEBHOOK = new URLPattern({ pathname: "/api/facebook" });
  const FACEBOOK_WEBHOOK_REDIRECT = new URLPattern({
    pathname: "/api/redirect/facebook",
  });

  if (FACEBOOK_WEBHOOK_REDIRECT.exec(req.url)) {
    return await handleFacebookRedirect(req);
  }

  if (WHATSAPP_WEBHOOK.exec(req.url)) {
    return await handleWhatsAppWebHook(req);
  }
  if (FACEBOOK_WEBHOOK.exec(req.url)) {
    return await facebookWebhookHandler(req);
  }
  if (TELEGRAM_WEBHOOK.exec(req.url)) {
    if (req.method === "POST") {
      try {
        // const body = await req.json();
        await handleTelegramWebHook(req);
        return new Response("OK", { status: 200 });
      } catch {
        return new Response("Bad request", { status: 400 });
      }
    }
  }

  if (req.method === "GET" && req.url.endsWith("/api/fetch/whatsapp")) {
    return await fetchLatestWhatsAppUpdate();
  }
  if (req.method === "GET" && req.url.endsWith("/api/fetch/telegram")) {
    return await fetchLatestTelegramUpdate();
  }
  if (req.method === "GET" && req.url.endsWith("/api/fetch/facebook")) {
    return await fetchLatestFacebookUpdate();
  }

  return new Response("Method not allowed", { status: 405 });
}

Deno.serve({ port: 3030 }, handler);
