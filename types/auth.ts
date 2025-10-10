import User from "./user";

export type LoginResponse = {
    id: string;
    email: string;
    username: string;
    roles: string[];
    jwt: string;
};

export type AuthContextType = {
    isAuthenticated: boolean;
    user: User | null;
    jwt: string | null;
    loading: boolean;
    setUser: (user: User | null) => void;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
};