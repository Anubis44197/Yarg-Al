export interface Decision {
    id: string; // The ID required by the specific get_document tool
    title: string;
    summary: string;
    date: string;
    decisionNumber: string;
    court?: string; // Mapped court name for display
    fullText?: string;
    documentUrl: string; // The full URL for display and for routing getDocument calls
}

export interface SearchResponse {
    results: Decision[];
    total: number;
    error: string | null;
}

export interface HistoryItem {
    term: string;
    pinned: boolean;
}
