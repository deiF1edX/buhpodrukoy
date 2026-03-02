// api/contact.js
export default async function handler(req, res) {
  // 1. Разрешаем только POST запросы
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // 2. Достаем данные из тела запроса
  const { name, phone } = req.body; // Принимаем phone

  // Проверяем
  if (!name || !phone) {
    return res.status(400).json({ error: "Заполните все поля" });
  }

  // 4. Достаем секреты из переменных окружения
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return res.status(500).json({ error: "Server config error" });
  }

  // 5. Формируем сообщение
  const text = `
🔒 *Заявка с сайта*
👤 *Имя:* ${name}
📞 *Телефон:* ${phone}
  `;

  try {
    // 6. Отправляем в Telegram
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
      return res.status(200).json({ success: true });
    } else {
      const errorData = await response.json();
      console.error("Telegram Error:", errorData); // Увидим в логах Vercel
      return res.status(502).json({ error: "Telegram API Error" });
    }
  } catch (error) {
    console.error("Internal Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
