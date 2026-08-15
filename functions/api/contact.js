import { EmailMessage } from "cloudflare:email";
import { createMimeMessage } from "mimetext";

export async function onRequestPost(context) {
  const { request, env } = context;

  let data;
  try {
    data = await request.json();
  } catch (err) {
    return new Response(JSON.stringify({ error: "invalid json" }), { status: 400 });
  }

  const name = (data.name || "").trim();
  const email = (data.email || "").trim();
  const message = (data.message || "").trim();
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!name || !emailOk || !message) {
    return new Response(JSON.stringify({ error: "invalid input" }), { status: 400 });
  }

  const msg = createMimeMessage();
  msg.setSender({ name: "noaa.jp お問い合わせフォーム", addr: env.CONTACT_FROM_ADDRESS });
  msg.setRecipient(env.CONTACT_TO_ADDRESS);
  msg.setSubject("【noaa.jp】お問い合わせがありました");
  msg.addMessage({
    contentType: "text/plain",
    data:
      "お名前: " + name + "\n" +
      "メールアドレス: " + email + "\n\n" +
      "お問い合わせ内容:\n" + message,
  });

  const emailMessage = new EmailMessage(
    env.CONTACT_FROM_ADDRESS,
    env.CONTACT_TO_ADDRESS,
    msg.asRaw()
  );

  try {
    await env.SEND_EMAIL.send(emailMessage);
  } catch (err) {
    return new Response(JSON.stringify({ error: "send failed" }), { status: 500 });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
