interface Env {
    DB: D1Database;
}

export async function onRequest(context: { request: Request; env: Env }) {
    const url = new URL(context.request.url);
    const itemId = url.searchParams.get('itemId');
    const userId = url.searchParams.get('userId');

    if (!itemId) {
        return new Response(JSON.stringify({ error: 'Missing itemId' }), { status: 400 });
    }

    try {
        if (context.request.method === 'GET') {
            const countResult = await context.env.DB.prepare(
                'SELECT COUNT(*) as count FROM votes WHERE item_id = ?'
            ).bind(itemId).first();

            // Check if this specific user loved it (if userId provided)
            let userLoved = false;
            if (userId) {
                const userResult = await context.env.DB.prepare(
                    'SELECT 1 FROM votes WHERE item_id = ? AND user_id = ?'
                ).bind(itemId, userId).first();
                userLoved = !!userResult;
            }

            return new Response(JSON.stringify({
                count: countResult?.count || 0,
                loved: userLoved
            }), { headers: { 'Content-Type': 'application/json' } });
        }

        if (context.request.method === 'POST') {
            if (!userId) {
                return new Response(JSON.stringify({ error: 'Missing userId' }), { status: 400 });
            }

            // Check if already voted
            const exists = await context.env.DB.prepare(
                'SELECT 1 FROM votes WHERE item_id = ? AND user_id = ?'
            ).bind(itemId, userId).first();

            if (exists) {
                // Remove Love
                await context.env.DB.prepare(
                    'DELETE FROM votes WHERE item_id = ? AND user_id = ?'
                ).bind(itemId, userId).run();
                return new Response(JSON.stringify({ loved: false }), { headers: { 'Content-Type': 'application/json' } });
            } else {
                // Add Love
                await context.env.DB.prepare(
                    'INSERT INTO votes (item_id, user_id) VALUES (?, ?)'
                ).bind(itemId, userId).run();
                return new Response(JSON.stringify({ loved: true }), { headers: { 'Content-Type': 'application/json' } });
            }
        }

        return new Response('Method not allowed', { status: 405 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Database error' }), { status: 500 });
    }
}