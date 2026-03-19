import { Resend } from "resend";
import { formatPrice, getProductLabel } from "@/config/products";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "noreply@royalpet.app";
const OWNER_EMAIL = process.env.OWNER_EMAIL || "";

// --- Types ---

export interface OrderEmailParams {
  orderId: string;
  portraitId: string;
  product: string; // e.g. "fine_art_30x40" or "digital"
  productType: string; // "digital" | "fine_art" | "canvas"
  priceCents: number;
  frameId: string | null;
  frameName: string | null;
  framePriceCents: number;
  totalCents: number;
  customerEmail: string;
  customerName: string | null;
  customerPhone: string | null;
  shippingAddress: {
    name?: string;
    line1?: string;
    line2?: string;
    city?: string;
    postal_code?: string;
    country?: string;
    phone?: string | null;
  } | null;
  portraitImageUrl: string; // clean image URL (customer paid)
  cleanDownloadUrl: string; // signed URL for high-res download
  customerDownloadUrl?: string; // signed URL for customer (24h, digital only)
  orderDate: Date;
}

// --- Helpers ---

/** Add 7 working days (skip weekends), return formatted Dutch date */
export function calculateShipDate(orderDate: Date): string {
  const date = new Date(orderDate);
  let added = 0;
  while (added < 7) {
    date.setDate(date.getDate() + 1);
    const day = date.getDay();
    if (day !== 0 && day !== 6) added++;
  }
  return date.toLocaleDateString("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatDutchDate(date: Date): string {
  return date.toLocaleDateString("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Generate inline CSS for frame around portrait image in emails */
function getFrameStyle(frameId: string | null): string {
  switch (frameId) {
    case "zwart_modern":
      return "display: inline-block; padding: 6px; border: 8px solid #1a1a1a; background: #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.15);";
    case "wit_modern":
      return "display: inline-block; padding: 6px; border: 8px solid #f5f5f0; background: #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.1);";
    case "klassiek_goud":
      return "display: inline-block; padding: 6px; border: 8px solid #B8942A; background: #FAF8F3; box-shadow: inset 0 0 0 2px #d4b44a, 0 2px 8px rgba(0,0,0,0.15);";
    case "klassiek_walnoot":
      return "display: inline-block; padding: 6px; border: 8px solid #5C3A1E; background: #FAF8F3; box-shadow: inset 0 0 0 2px #7a5233, 0 2px 8px rgba(0,0,0,0.15);";
    case "antiek_zilver":
      return "display: inline-block; padding: 6px; border: 8px solid #A8A8A8; background: #FAF8F3; box-shadow: inset 0 0 0 2px #c0c0c0, 0 2px 8px rgba(0,0,0,0.15);";
    default:
      // No frame or "geen" — simple subtle border
      return "display: inline-block; padding: 8px; border: 3px solid #B8942A; border-radius: 4px; background: #FAF8F3;";
  }
}

function formatAddress(
  addr: OrderEmailParams["shippingAddress"],
  phone?: string | null
): string {
  if (!addr) return "—";
  const lines = [
    addr.name,
    addr.line1,
    addr.line2,
    [addr.postal_code, addr.city].filter(Boolean).join(" "),
    addr.country,
  ].filter(Boolean);
  const phoneStr = phone || addr.phone;
  if (phoneStr) lines.push(`Tel: ${phoneStr}`);
  return lines.join("<br>");
}

// --- Email wrapper ---

const emailStyles = {
  body: 'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background-color: #FAF8F3; margin: 0; padding: 20px;',
  container:
    "max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);",
  header:
    "background-color: #0A0A0A; color: #B8942A; padding: 24px 32px; text-align: center;",
  headerTitle:
    'font-family: "Georgia", serif; font-size: 24px; margin: 0; letter-spacing: 1px;',
  content: "padding: 32px;",
  label:
    "font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #888; margin: 0 0 4px 0;",
  value: "font-size: 16px; color: #0A0A0A; margin: 0 0 20px 0;",
  divider: "border: none; border-top: 1px solid #eee; margin: 24px 0;",
  button:
    "display: inline-block; background-color: #B8942A; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: 600; font-size: 16px;",
  footer:
    "text-align: center; padding: 20px 32px; color: #888; font-size: 12px;",
  imgContainer:
    "text-align: center; margin-bottom: 24px;",
};

function wrapEmail(title: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="nl">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="${emailStyles.body}">
  <div style="${emailStyles.container}">
    <div style="${emailStyles.header}">
      <h1 style="${emailStyles.headerTitle}">${title}</h1>
    </div>
    <div style="${emailStyles.content}">
      ${bodyHtml}
    </div>
    <div style="${emailStyles.footer}">
      <p style="margin: 0 0 4px 0;"><a href="https://royalpet.app" style="color: #B8942A; text-decoration: none;">royalpet.app</a></p>
      <p style="margin: 0 0 4px 0;"><a href="mailto:support@royalpet.app" style="color: #888; text-decoration: none;">support@royalpet.app</a></p>
      <p style="margin: 0; color: #aaa;">Vereeuw uw trouwe metgezel</p>
    </div>
  </div>
</body>
</html>`;
}

// --- Owner notification ---

export async function sendOwnerNotification(
  params: OrderEmailParams
): Promise<void> {
  const {
    orderId,
    portraitId,
    product,
    productType,
    frameId,
    frameName,
    framePriceCents,
    totalCents,
    customerEmail,
    customerPhone,
    shippingAddress,
    portraitImageUrl,
    cleanDownloadUrl,
    orderDate,
  } = params;

  const productLabel = getProductLabel(product);
  const isPhysical = productType !== "digital";
  const frameStyle = getFrameStyle(frameId);

  let bodyHtml = `
    <div style="${emailStyles.imgContainer}">
      <div style="${frameStyle}">
        <img src="${portraitImageUrl}" alt="Portret" style="max-width: 264px; display: block;" />
      </div>
    </div>

    <p style="${emailStyles.label}">Bestelling</p>
    <p style="${emailStyles.value}">${orderId}</p>

    <p style="${emailStyles.label}">Product</p>
    <p style="${emailStyles.value}">${productLabel}</p>`;

  if (frameName && frameName !== "geen") {
    bodyHtml += `
    <p style="${emailStyles.label}">Kader</p>
    <p style="${emailStyles.value}">${frameName} (${formatPrice(framePriceCents)})</p>`;
  }

  bodyHtml += `
    <p style="${emailStyles.label}">Totaal betaald</p>
    <p style="${emailStyles.value}"><strong>${formatPrice(totalCents)}</strong></p>

    <hr style="${emailStyles.divider}" />

    <p style="${emailStyles.label}">Klant e-mail</p>
    <p style="${emailStyles.value}">${customerEmail}</p>`;

  if (customerPhone) {
    bodyHtml += `
    <p style="${emailStyles.label}">Telefoonnummer</p>
    <p style="${emailStyles.value}">${customerPhone}</p>`;
  }

  if (isPhysical && shippingAddress) {
    bodyHtml += `
    <p style="${emailStyles.label}">Verzendadres</p>
    <p style="${emailStyles.value}">${formatAddress(shippingAddress, customerPhone)}</p>`;
  }

  bodyHtml += `
    <p style="${emailStyles.label}">Besteldatum</p>
    <p style="${emailStyles.value}">${formatDutchDate(orderDate)}</p>`;

  if (isPhysical) {
    bodyHtml += `
    <p style="${emailStyles.label}">Verwachte verzenddatum</p>
    <p style="${emailStyles.value}">${calculateShipDate(orderDate)}</p>`;
  }

  bodyHtml += `
    <hr style="${emailStyles.divider}" />
    <p style="text-align: center; margin-top: 24px;">
      <a href="${cleanDownloadUrl}" style="${emailStyles.button}">Download High-Res Afbeelding</a>
    </p>
    <p style="text-align: center; color: #888; font-size: 12px; margin-top: 8px;">
      Portret ID: ${portraitId}
    </p>`;

  const subject = isPhysical
    ? `Nieuwe bestelling: ${productLabel} — ${orderId}`
    : `Nieuwe digitale bestelling — ${orderId}`;

  await resend.emails.send({
    from: `RoyalPet Orders <${FROM_EMAIL}>`,
    replyTo: OWNER_EMAIL,
    to: OWNER_EMAIL,
    subject,
    html: wrapEmail("Nieuwe Bestelling", bodyHtml),
  });
}

// --- Customer confirmation ---

export async function sendCustomerConfirmation(
  params: OrderEmailParams
): Promise<void> {
  const {
    orderId,
    product,
    productType,
    frameId,
    frameName,
    framePriceCents,
    totalCents,
    customerEmail,
    customerName,
    shippingAddress,
    portraitImageUrl,
    orderDate,
  } = params;

  const productLabel = getProductLabel(product);
  const isPhysical = productType !== "digital";
  const displayName = customerName || customerEmail.split("@")[0];
  const frameStyle = getFrameStyle(frameId);

  let bodyHtml = `
    <p style="font-size: 16px; color: #0A0A0A; margin: 0 0 20px 0;">
      Beste ${displayName},
    </p>
    <p style="color: #555; margin: 0 0 24px 0;">
      Bedankt voor uw bestelling bij RoyalPet.app!
    </p>

    <div style="${emailStyles.imgContainer}">
      <div style="${frameStyle}">
        <img src="${portraitImageUrl}" alt="Uw portret" style="max-width: 264px; display: block;" />
      </div>
    </div>

    <p style="font-size: 18px; color: #0A0A0A; margin: 0 0 8px 0;">
      Uw bestelling is bevestigd
    </p>
    <p style="color: #555; margin: 0 0 24px 0;">
      Wij gaan direct aan de slag. Verwachte levertijd: 7-9 werkdagen.
    </p>

    <hr style="${emailStyles.divider}" />

    <p style="${emailStyles.label}">Bestelnummer</p>
    <p style="${emailStyles.value}">${orderId}</p>

    <p style="${emailStyles.label}">Product</p>
    <p style="${emailStyles.value}">${productLabel}</p>`;

  if (frameName && frameName !== "geen") {
    bodyHtml += `
    <p style="${emailStyles.label}">Kader</p>
    <p style="${emailStyles.value}">${frameName} (${formatPrice(framePriceCents)})</p>`;
  }

  bodyHtml += `
    <p style="${emailStyles.label}">Totaal</p>
    <p style="${emailStyles.value}"><strong>${formatPrice(totalCents)}</strong></p>

    <p style="${emailStyles.label}">Besteldatum</p>
    <p style="${emailStyles.value}">${formatDutchDate(orderDate)}</p>`;

  if (isPhysical && shippingAddress) {
    bodyHtml += `
    <hr style="${emailStyles.divider}" />
    <p style="${emailStyles.label}">Verzendadres</p>
    <p style="${emailStyles.value}">${formatAddress(shippingAddress)}</p>`;
  }

  bodyHtml += `
    <hr style="${emailStyles.divider}" />
    <p style="color: #555; font-size: 14px;">
      U ontvangt een e-mail zodra uw bestelling is verzonden met een track & trace code.
    </p>
    <p style="text-align: center; color: #888; font-size: 12px; margin-top: 12px;">
      Vragen? Neem contact op via <a href="mailto:support@royalpet.app" style="color: #B8942A;">support@royalpet.app</a>
    </p>`;

  await resend.emails.send({
    from: `RoyalPet.app <${FROM_EMAIL}>`,
    replyTo: OWNER_EMAIL,
    to: customerEmail,
    subject: "Uw RoyalPet bestelling is bevestigd",
    html: wrapEmail("RoyalPet.app", bodyHtml),
  });
}
