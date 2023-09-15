//Reference: https://www.mikealche.com/software-development/how-to-implement-authentication-in-next-js-without-third-party-libraries
import React, { createContext, ReactNode, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';

interface AuthContextType {
    user: string | null;
    login: (email: string, password: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<string | null>(null);

    useEffect(() => {
        async function loadUserFromCookies() {
            const savedUser = Cookies.get('user');
            console.log("Got a user in the cookies", savedUser)
            
            if (savedUser) {
                setUser(savedUser);
            }
        }
    
        loadUserFromCookies();
    }, []);

    const login = async (email: string, password: string) => {
        //TODO: implement login
        Cookies.set('user', email, { expires: 1 }); //TODO: expires: 1 is for testing only
        setUser(email);
    };

    const logout = () => {
        Cookies.remove('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
