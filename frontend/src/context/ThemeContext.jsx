import { createContext } from "react";

// Dark mode is explicitly cut from the MVP (see MVP doc, section 7), so
// this provider intentionally does not expose a toggle — it just supplies
// a stable "light" value so components that already reference dark:
// Tailwind classes (Navbar, DashboardLayout) don't need to be touched.
// If dark mode gets picked up later, add a toggle + persisted state here.
export const ThemeContext = createContext({ theme: "light" });

export default function ThemeProvider({ children }) {
    return (
        <ThemeContext.Provider value={{ theme: "light" }}>
            {children}
        </ThemeContext.Provider>
    );
}
