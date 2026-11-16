import { getEntry } from "astro:content";
export async function snippetBlocks(id: string) {
  const e = await getEntry("snippets", id);
  if (!e) throw new Error(`Missing snippet ${id}`);
  return e.data.blocks ?? [];
}
export async function snippetBlock(id: string, label: string) {
  const b = (await snippetBlocks(id)).find((x) => x.label === label);
  if (!b) throw new Error(`Missing snippet block ${id}:${label}`);
  return b;
}
