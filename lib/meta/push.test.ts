import { describe, expect, it } from "vitest";
import { endpointPermitido } from "./push";

describe("endpointPermitido", () => {
  it("aceita os serviços de push conhecidos", () => {
    expect(endpointPermitido("https://fcm.googleapis.com/fcm/send/abc")).toBe(true);
    expect(endpointPermitido("https://updates.push.services.mozilla.com/wpush/v2/x")).toBe(true);
    expect(endpointPermitido("https://web.push.apple.com/abc")).toBe(true);
  });
  it("recusa qualquer outro endereço", () => {
    for (const e of [
      "http://fcm.googleapis.com/x",
      "https://fcm.googleapis.com.evil.com/x",
      "https://169.254.169.254/latest",
      "https://fcm.googleapis.com:8443/x",
      "https://exemplo.com/push",
      "nada",
      42,
    ]) {
      expect(endpointPermitido(e)).toBe(false);
    }
  });
});
