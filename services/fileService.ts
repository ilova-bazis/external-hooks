export async function saveToFile(filePath: string, data: object) {
  await Deno.writeTextFile(filePath, JSON.stringify(data, null, 2));
}

export async function readFromFile(filePath: string): Promise<object[]> {
  try {
    const content = await Deno.readTextFile(filePath);
    return JSON.parse(content);
  } catch {
    return [];
  }
}
