import crypto from "node:crypto";

if (!globalThis.crypto) {
  // @ts-expect-error Node 18 webcrypto compatibility
  globalThis.crypto = crypto.webcrypto;
}
