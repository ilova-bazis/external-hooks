import { saveToFile, readFromFile } from "../services/fileService.ts";
import { WHATSAPP_FILE } from "../utils/constants.ts";

const whatsappUpdates: object[] = [];


export async function handleWhatsAppWebHook(req: Request): Promise<Response> {
    try {
      const body = await req.json();
      console.log("Received WhatsApp update:", body);
  
      whatsappUpdates.push(body);
      const currentData = await readFromFile(WHATSAPP_FILE);
      currentData.push(body);
      await saveToFile(WHATSAPP_FILE, currentData);
  
      return new Response("WhatsApp webhook received", { status: 200 });
    } catch (error) {
      console.error("Error handling WhatsApp webhook:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  }

export function fetchLatestWhatsAppUpdate(): Response {
  console.log("Fetching latest WhatsApp message");
  if (whatsappUpdates.length === 0) {
    return new Response("No WhatsApp data found", { status: 404 });
  }
  return new Response(JSON.stringify(whatsappUpdates.pop()), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}