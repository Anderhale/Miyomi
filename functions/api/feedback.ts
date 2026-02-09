interface FeedbackRequest {
  type: string;
  message: string;
  page?: string;
  sourcePage?: string;
  timestamp: string;
}

export async function onRequestPost(context: any) {
  try {
    const request = context.request;
    const body: FeedbackRequest = await request.json();

    // Get environment variables from Cloudflare Pages
    const TELEGRAM_BOT_TOKEN = context.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = context.env.TELEGRAM_CHAT_ID;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.error('Missing Telegram environment variables');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!body.message || !body.type) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Format the emoji based on type
    const emojiMap: Record<string, string> = {
      submit: '➕',
      update: '❗',
      report: '❌',
      suggest: '💡',
      love: '❤️',
      other: '💬',
    };

    const emoji = emojiMap[body.type] || '💬';

    // Use sourcePage if available, otherwise page, otherwise 'Unknown'
    const pageInfo = body.sourcePage || body.page || 'Anonymous';

    const telegramMessage = `
${emoji} <b>New Feedback - Miyomi</b>

<b>Type:</b> ${body.type.charAt(0).toUpperCase() + body.type.slice(1)}
<b>Source:</b> ${pageInfo}
<b>Time:</b> ${new Date(body.timestamp).toLocaleString()}

<b>Message:</b>
${body.message}
    `.trim();

    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    const telegramResponse = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: telegramMessage,
        parse_mode: 'HTML',
      }),
    });

    if (!telegramResponse.ok) {
      console.error('Telegram API error:', await telegramResponse.text());
      return new Response(
        JSON.stringify({ error: 'Failed to send message to Telegram' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Feedback received' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Feedback API error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
