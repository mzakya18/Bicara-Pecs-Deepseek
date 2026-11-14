export const FLAGS = [
  "Belum bisa bicara (non-verbal)",
  "Spektrum autisme",
  "Takut suara keras atau keramaian",
  "Tidak mengenali nama sendiri",
  "Mudah panik saat dipegang orang asing",
  "Tidak bisa berjalan jauh",
  "Harus minum obat rutin",
  "Riwayat kejang (epilepsi)",
  "Gangguan penglihatan",
  "Gangguan pendengaran",
  "Suka lari atau menghindar",
  "Tenang jika diberi benda kesukaan"
];

export function b64url(bytes: Uint8Array) {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function unb64url(str: string) {
  let s = str.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  const bin = atob(s);
  return Uint8Array.from(bin, c => c.charCodeAt(0));
}

async function transform(bytes: Uint8Array, stream: any) {
  const out = new Blob([bytes]).stream().pipeThrough(stream);
  return new Uint8Array(await new Response(out).arrayBuffer());
}

export async function packData(d: any) {
  const enc = new TextEncoder();
  const raw = enc.encode(JSON.stringify([d.n, d.k, d.i, d.u, d.w, d.cn, d.cw, String(d.f)]));
  if ("CompressionStream" in window) {
    const c = await transform(raw, new CompressionStream("deflate-raw"));
    if (c.length < raw.length) return "c=" + b64url(c);
  }
  return "u=" + b64url(raw);
}

export async function unpackData(payload: string) {
  const tag = payload.slice(0, 2);
  let raw = unb64url(payload.slice(2));
  if (tag === "c=") {
    raw = await transform(raw, new DecompressionStream("deflate-raw"));
  }
  const dec = new TextDecoder();
  const arr = JSON.parse(dec.decode(raw));
  const mask = parseInt(arr[7], 10);
  return { n: arr[0], k: arr[1], i: arr[2], u: arr[3], w: arr[4], cn: arr[5], cw: arr[6], f: mask };
}

export function flagsToLabels(mask: number) {
  return FLAGS.filter((_, idx) => (mask & (1 << idx)) !== 0);
}
