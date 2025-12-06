export interface WebSocketMessage {
    type: 'connection' | 'message' | 'error' | 'pong' | 'history' | 'clear_history';
    status?: 'authenticated' | 'disconnected';
    user_id?: string;
    username?: string;
    sender_id?: string;
    sender_username?: string;
    message?: string;
    is_self?: boolean;
    timestamp?: string;
    cleared_by?: string;
    cleared_by_id?: string;
    messages?: Array<{
        message: string;
        sender_id: string;
        sender_username: string;
        timestamp: string;
    }>;
}  
export interface ChatMessage {
    id: string;
    text: string;
    userId: string;
    username: string;
    timestamp: Date;
    isSelf?: boolean;
}
