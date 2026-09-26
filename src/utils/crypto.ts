// SHA-256 cryptographic utility using Web Crypto API for tamper-evident audit trails

export async function sha256(message: string): Promise<string> {
  // Encode as UTF-8
  const msgBuffer = new TextEncoder().encode(message);
  // Hash the message
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  // Convert ArrayBuffer to Array
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  // Convert bytes to hex string
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export function syncHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `0x${hex}fa7b99c${hex.split('').reverse().join('')}`.slice(0, 18);
}
