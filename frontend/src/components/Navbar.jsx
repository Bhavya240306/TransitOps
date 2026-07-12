import { Bell, UserCircle } from "lucide-react";

export default function Navbar() {
    return (

        <header className="h-16 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-b flex justify-between items-center px-8">

            <div>

                <h1 className="font-bold text-xl">
                    Smart Transport Operations Platform
                </h1>

            </div>

            <div className="flex gap-6 items-center">

                <Bell />

                <div className="flex items-center gap-2">

                    <UserCircle size={34} />

                    <div>

                        <h2 className="font-semibold">
                            Fleet Manager
                        </h2>

                        <p className="text-sm text-gray-500">
                            Admin
                        </p>

                    </div>

                </div>

            </div>

        </header>
    );
}