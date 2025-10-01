interface UserProfile {
    id: string;
    name: string;
    username: string;
    points: number;
    itemsFound: number;
    itemsReturned: number;
    avatarUrl: string;
}

interface LeaderboardEntry {
    username: string;
    points: number;
    rank: number;
}

interface Achievement {
    id: string;
    title: string;
    description: string;
    points: number;
    isUnlocked: boolean;
}

export type { UserProfile, LeaderboardEntry, Achievement };