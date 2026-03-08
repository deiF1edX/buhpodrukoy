// Файл: api/contact.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { name, phone } = req.body;

  // ИСПРАВЛЕНИЕ: Используем имена точно как в Vercel
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return res
      .status(500)
      .json({ message: "Telegram token or Chat ID is missing" });
  }

  const text = `
🔥 *Новая заявка с сайта!*
👤 *Имя:* ${name}
📞 *Телефон:* ${phone}
  `;

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: "Markdown",
        }),
      },
    );

    if (response.ok) {
      return res.status(200).json({ message: "Success" });
    } else {
      const errorData = await response.json();
      console.error("Telegram Error:", errorData); // Для логов
      return res.status(500).json({ message: "Telegram API Error" });
    }
  } catch (error) {
    console.error("Server Error:", error); // Для логов
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
