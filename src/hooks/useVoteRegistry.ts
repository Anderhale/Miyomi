import { useState, useEffect } from 'react';
import { useAnonymousId } from './useAnonymousId';

export interface VoteData {
    count: number;
    loved: boolean;
}

export function useVoteRegistry() {
    const userId = useAnonymousId();
    const [votes, setVotes] = useState<Record<string, VoteData>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) return;

        const fetchAllVotes = async () => {
            try {
                const res = await fetch(`/api/vote?userId=${userId}`);
                if (res.ok) {
                    const data = await res.json();
                    setVotes(data);
                }
            } catch (error) {
                console.error('Failed to fetch vote registry', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllVotes();
    }, [userId]);

    return { votes, loading };
}