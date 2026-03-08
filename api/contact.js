export default async function handler(req, res) {
  // Проверяем, что метод запроса — POST
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // Получаем данные из тела запроса
  const { name, phone } = req.body;

  // Берем секретные ключи из Vercel Environment Variables
  const token = process.env.TELEGRAM_TOKEN;
  const chatId = process.env.CHAT_ID;

  if (!token || !chatId) {
    return res.status(500).json({ message: "Server configuration error" });
  }

  const text = `
🔥 *Новая заявка с сайта!*
👤 *Имя:* ${name}
📞 *Телефон:* ${phone}
  `;

  try {
    // Отправляем запрос в Telegram
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
      console.error("Telegram Error:", errorData);
      return res.status(500).json({ message: "Telegram API Error" });
    }
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
