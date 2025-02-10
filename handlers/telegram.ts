import { TelegramUpdate } from "../types.ts";
import { saveToFile } from "../services/fileService.ts";
import { TELEGRAM_FILE } from "../utils/constants.ts";

const telegramUpdates: TelegramUpdate[] = [];

export async function handleTelegramWebHook(req: Request): Promise<Response> {
  try {
    const update: TelegramUpdate = await req.json();
    console.log("Received Telegram update:", update);

    telegramUpdates.push(update);
    await saveToFile(TELEGRAM_FILE, telegramUpdates);

    return new Response("Telegram webhook received", { status: 200 });
  } catch (error) {
    console.error("Error handling Telegram webhook:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export function fetchLatestTelegramUpdate(): Response {
  if (telegramUpdates.length === 0) {
    return new Response("No Telegram data found", { status: 404 });
  }

  const latestUpdate = telegramUpdates.pop();
  return new Response(
    JSON.stringify(latestUpdate),
    {
      status: 200,
      headers: { "content-type": "application/json" },
    },
  );
}
