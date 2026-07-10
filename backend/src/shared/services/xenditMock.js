import crypto from "crypto";

export function createMockXenditInvoice({ bookingId, amount, movieTitle }) {
  const externalId = `booking-${bookingId}-${Date.now()}`;
  const invoiceId = `xnd_mock_${crypto.randomBytes(8).toString("hex")}`;
  const apiKey = process.env.XENDIT_API_KEY || "";
  const qrString = [
    "00020101021226680016ID.CO.XENDIT.WWW01189360091500000000000215",
    invoiceId.toUpperCase(),
    "5204549953033605802ID5913BEATRIX MOVIE6007JAKARTA6304MOCK"
  ].join("");

  return {
    externalId,
    invoiceId,
    invoiceUrl: `${process.env.CLIENT_URL || "http://localhost:5173"}/#payment`,
    paymentMethod: "QRIS",
    qrString,
    qrExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
    amount,
    status: "PENDING",
    apiKeyMode: apiKey.startsWith("xnd_development_") ? "development" : "mock",
    description: `Mock Xendit QRIS invoice for ${movieTitle}`
  };
}
