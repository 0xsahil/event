/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable react-refresh/only-export-components */
import { Models } from 'appwrite';
import { useState, useEffect, ReactNode, createContext, useContext } from 'react';
import { logIn, deleteCurrentSession, getCurrentSession, verifySession, VerifySessionTypes } from '@/lib/auth';
import { getTeams } from '@/lib/user';

interface AuthContextTypes {
    session?: Models.Session,
    isAdmin?: boolean,
    logIn: Function,
    logOut: Function,
    verifyCurrentSession: Function,
}

export const AuthContext = createContext<AuthContextTypes | undefined>(undefined);

interface AuthProviderTypes {
    children?: ReactNode;
}

export function useAuthState() {
    const [session, setSession] = useState<Models.Session>();
    const [isAdmin, setIsAdmin] = useState<boolean>();
    useEffect(() => {
        (async function run() {
            const data = await getCurrentSession();
            setSession(data.session);
        })();
    }, [])

    useEffect(() => {
        if (!session?.$id) return;
        (async function run() {
            const { teams } = await getTeams();
            const isadmin = !!teams.find(team => team.$id === import.meta.env.VITE_APPWRITE_TEAM_ADMIN_ID);
            setIsAdmin(isadmin);
        })();
    }, [session?.$id])

    async function logOut() {
        await deleteCurrentSession();
        setSession(undefined);
    }
    async function verifyCurrentSession(values: VerifySessionTypes) {
        const data = await verifySession(values);
        setSession(data);
    }
    return {
        session,
        isAdmin,
        logIn,
        logOut,
        verifyCurrentSession
    }
}


export const AuthProvider = ({ children }: AuthProviderTypes) => {
    const auth = useAuthState();
    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    )
}


export function useAuth() {
    const auth = useContext(AuthContext);
    if (!auth) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return auth
} 
