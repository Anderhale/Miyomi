import { useState, useEffect } from 'react';
import { useAnonymousId } from './useAnonymousId';
import { voteStorage, VoteRegistry } from '../utils/voteStorage';

export interface VoteData {
    count: number;
    loved: boolean;
}

export function useVoteRegistry() {
    const userId = useAnonymousId();
    // 1. Initialize from Cache immediately
    const [votes, setVotes] = useState<VoteRegistry>(() => {
        const cached = voteStorage.get();
        // console.log('[useVoteRegistry] Initializing from cache. Items:', Object.keys(cached).length);
        return cached;
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) return;

        const fetchAllVotes = async () => {
            try {
                const res = await fetch(`/api/vote?userId=${userId}`);
                if (res.ok) {
                    const data = await res.json();
                    // 2. Update State AND Cache
                    setVotes(data);
                    voteStorage.set(data);
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