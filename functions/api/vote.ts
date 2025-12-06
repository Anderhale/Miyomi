interface Env {
    DB: D1Database;
}

export async function onRequest(context: { request: Request; env: Env }) {
    const url = new URL(context.request.url);
    const itemId = url.searchParams.get('itemId');
    const itemIdsParam = url.searchParams.get('itemIds');
    const userId = url.searchParams.get('userId');

    if (!context.env.DB) {
        return new Response(JSON.stringify({ error: 'Database binding missing' }), { status: 500 });
    }

    try {
        if (context.request.method === 'GET') {

            //  Global Fetch 
            if (!itemId && !itemIdsParam) {
                const allCounts = await context.env.DB.prepare(
                    'SELECT item_id, COUNT(*) as count FROM votes GROUP BY item_id'
                ).all();

                let userLikes: string[] = [];
                if (userId) {
                    const userResults = await context.env.DB.prepare(
                        'SELECT item_id FROM votes WHERE user_id = ?'
                    ).bind(userId).all();
                    userLikes = userResults.results.map((r: any) => r.item_id as string);
                }

                const responseMap: Record<string, { count: number, loved: boolean }> = {};

                allCounts.results.forEach((r: any) => {
                    responseMap[r.item_id] = {
                        count: r.count as number,
                        loved: false
                    };
                });

                userLikes.forEach(id => {
                    if (!responseMap[id]) {
                        responseMap[id] = { count: 0, loved: true };
                    } else {
                        responseMap[id].loved = true;
                    }
                });

                return new Response(JSON.stringify(responseMap), {
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            if (itemId) {
                const countResult = await context.env.DB.prepare(
                    'SELECT COUNT(*) as count FROM votes WHERE item_id = ?'
                ).bind(itemId).first();

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
        }

        if (context.request.method === 'POST') {
            if (!itemId) return new Response(JSON.stringify({ error: 'Missing itemId' }), { status: 400 });
            if (!userId) return new Response(JSON.stringify({ error: 'Missing userId' }), { status: 400 });

            const exists = await context.env.DB.prepare(
                'SELECT 1 FROM votes WHERE item_id = ? AND user_id = ?'
            ).bind(itemId, userId).first();

            if (exists) {
                await context.env.DB.prepare(
                    'DELETE FROM votes WHERE item_id = ? AND user_id = ?'
                ).bind(itemId, userId).run();
                return new Response(JSON.stringify({ loved: false }), { headers: { 'Content-Type': 'application/json' } });
            } else {
                await context.env.DB.prepare(
                    'INSERT INTO votes (item_id, user_id) VALUES (?, ?)'
                ).bind(itemId, userId).run();
                return new Response(JSON.stringify({ loved: true }), { headers: { 'Content-Type': 'application/json' } });
            }
        }

        return new Response('Method not allowed', { status: 405 });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: 'Database error', details: error.message }), { status: 500 });
    }
}