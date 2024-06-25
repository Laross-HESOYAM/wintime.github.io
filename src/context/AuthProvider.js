import { createContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    // const [auth, setAuth] = useState('loloo');
    const [cont, setCont] = useState()


    return (
        <AuthContext.Provider value={{ cont, setCont }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;