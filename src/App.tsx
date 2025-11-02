import {
	WalletDisconnectButton,
	WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import "./App.css";
import Airdrop from "./components/Airdrop";
import SolBalance from "./components/SolBalance";
import SignMessage from "./components/SignMessage";
import SendSolana from "./components/SendSolana";
import CreateToken from "./components/CreateToken";
import Tokenlist from "./components/Tokenlist";
import ThemeToggle from "./components/ThemeToggle";
import { Toaster } from "react-hot-toast";

import { useTheme } from "./contexts/ThemeContext";

function App() {
	const { theme } = useTheme();

	return (
		<div className="app-container">
			<Toaster
				position="top-right"
				toastOptions={{
					duration: 4000,
					style: {
						background:
							theme === "light"
								? "rgba(255, 255, 255, 0.95)"
								: "rgba(0, 0, 0, 0.8)",
						color: theme === "light" ? "#1e293b" : "#fff",
						border:
							theme === "light"
								? "1px solid rgba(0, 0, 0, 0.1)"
								: "1px solid rgba(255, 255, 255, 0.2)",
						backdropFilter: "blur(10px)",
					},
				}}
			/>

			<header className="sticky top-0 z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
				<div className="main-content">
					<div className="flex flex-col sm:flex-row items-center justify-between py-4 gap-4">
						<div className="flex items-center gap-4">
							<h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
								OrbApp Wallet
							</h1>
						</div>

						<div className="flex items-center gap-3">
							<ThemeToggle />
							<div className="hidden sm:block">
								<SolBalance />
							</div>
							<WalletMultiButton className="bg-linear-to-r! from-blue-500! to-purple-600! rounded-xl! font-semibold! transition-all! duration-300! hover:scale-105!" />
							<WalletDisconnectButton className="bg-red-500/20! border-red-500/50! text-red-400! rounded-xl! font-semibold! transition-all! duration-300! hover:bg-red-500/30!" />
						</div>
					</div>

					<div className="sm:hidden pb-4">
						<SolBalance />
					</div>
				</div>
			</header>

			<main className="main-content">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-8">
					<div className="space-y-6">
						<div className="section-card">
							<h2 className="text-xl font-semibold mb-4 text-white">
								Airdrop SOL
							</h2>
							<Airdrop />
						</div>

						<div className="section-card">
							<h2 className="text-xl font-semibold mb-4 text-white">
								Send SOL
							</h2>
							<SendSolana />
						</div>

						<div className="section-card">
							<h2 className="text-xl font-semibold mb-4 text-white">
								Sign Message
							</h2>
							<SignMessage />
						</div>
					</div>

					<div className="space-y-6">
						<div className="section-card">
							<h2 className="text-xl font-semibold mb-4 text-white">
								Create Token
							</h2>
							<CreateToken />
						</div>

						<div className="section-card">
							<h2 className="text-xl font-semibold mb-4 text-white">
								Your Tokens
							</h2>
							<Tokenlist />
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}

export default App;
