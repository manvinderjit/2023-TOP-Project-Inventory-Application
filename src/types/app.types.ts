import { SessionData } from 'express-session'; 

// Augment express-session with a custom SessionData object
declare module 'express-session' {
    export interface SessionData {
        userId: string;
        authorized: boolean;
    }
};
