import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const SIGNUP_ROLES = ["DRIVER", "SAFETY_OFFICER", "FINANCIAL_ANALYST"];

export default function Login() {

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [mode, setMode] = useState("login"); // "login" | "signup"
    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [role, setRole] = useState(SIGNUP_ROLES[0]);

    async function handleSubmit(e) {

        e.preventDefault();
        setLoading(true);

        try {

            if (mode === "login") {

                const res = await api.post("/auth/login", { email, password });
                login(res.data.data);
                toast.success("Welcome back!");

            } else {

                const res = await api.post("/auth/signup", { email, password, fullName, role });
                login(res.data.data);
                toast.success("Account created!");

            }

            navigate("/dashboard");

        } catch (err) {

            const message = err.response?.data?.error?.message || "Something went wrong";
            toast.error(message);

        } finally {

            setLoading(false);

        }

    }

    return (

        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-blue-50">

            <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-md">

                <h1 className="text-2xl font-bold mb-1">TransitOps</h1>
                <p className="text-gray-500 mb-8">
                    {mode === "login" ? "Sign in to your account" : "Create a new account"}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {mode === "signup" && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Full Name</label>
                            <input
                                type="text"
                                required
                                className="border rounded-lg px-4 py-2 w-full"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            required
                            className="border rounded-lg px-4 py-2 w-full"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <input
                            type="password"
                            required
                            className="border rounded-lg px-4 py-2 w-full"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {mode === "signup" && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Role</label>
                            <select
                                className="border rounded-lg px-4 py-2 w-full"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            >
                                {SIGNUP_ROLES.map((r) => (
                                    <option key={r} value={r}>{r.replace("_", " ")}</option>
                                ))}
                            </select>
                            <p className="text-xs text-gray-400 mt-1">
                                Fleet Manager accounts are created directly by an admin, not via signup.
                            </p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-5 py-2 rounded-lg w-full mt-2 disabled:opacity-60"
                    >
                        {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Sign Up"}
                    </button>

                </form>

                <button
                    onClick={() => setMode(mode === "login" ? "signup" : "login")}
                    className="text-blue-600 text-sm mt-6 w-full text-center"
                >
                    {mode === "login" ? "Need an account? Sign up" : "Already have an account? Sign in"}
                </button>

            </div>

        </div>

    );

}
