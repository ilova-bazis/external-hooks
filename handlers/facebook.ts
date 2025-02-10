import { readFromFile, saveToFile } from "../services/fileService.ts";
import { FACEBOOK_FILE, VERIFICATION_TOKEN } from "../utils/constants.ts";

const facebookUpdates: object[] = [];

export async function handleFacebookWebHook(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    console.log("Received Facebook update:", body);

    facebookUpdates.push(body);
    const currentData = await readFromFile(FACEBOOK_FILE);
    currentData.push(body);
    await saveToFile(FACEBOOK_FILE, currentData);

    return new Response("Facebook webhook received", { status: 200 });
  } catch (error) {
    console.error("Error handling Facebook webhook:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function facebookWebhookHandler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  console.log("Processing Facebook webhook");

  if (req.method === "GET") {
    console.log("GET VERIFICATION");
    const hubMode = url.searchParams.get("hub.mode");
    const hubToken = url.searchParams.get("hub.verify_token");
    const hubChallenge = url.searchParams.get("hub.challenge");

    if (hubMode === "subscribe" && hubToken === VERIFICATION_TOKEN) {
      return new Response(hubChallenge, { status: 200 });
    }
    return new Response("Verification failed", { status: 403 });
  }

  if (req.method === "POST") {
    try {
      const body = await req.json();
      await handleFacebookWebHook(body);
      return new Response("Facebook webhook received", { status: 200 });
    } catch (error) {
      console.error("Error handling Facebook webhook:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  }
  return new Response("Method not allowed", { status: 405 });
}

export function fetchLatestFacebookUpdate(): Response {
  console.log("Fetching latest Facebook message");
  if (facebookUpdates.length === 0) {
    return new Response("No Facebook data found", { status: 404 });
  }
  return new Response(JSON.stringify(facebookUpdates.pop()), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}

export async function handleFacebookRedirect(req: Request): Promise<Response> {
    await Deno.writeFile("facebook_redirect.txt", new TextEncoder().encode(req.url));
    console.log("FACEBOOK REDIRECT");
    console.log(req);
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    console.log("Code:", code);
    console.log("State:", state);
    if (code) {
        return new Response("OK", { status: 200 });
    }
    return new Response("Bad request", { status: 400 });
}