import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useEffect, useState } from "react";

export default function SolBalance() {
	const [balance, setBalance] = useState<number | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { connection } = useConnection();
	const wallet = useWallet();

	async function getBalance() {
		if (!wallet.publicKey) {
			setBalance(null);
			setLoading(false);
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const response = await connection.getBalance(wallet.publicKey);
			setBalance(response / LAMPORTS_PER_SOL);
		} catch (error) {
			console.error("Error fetching balance:", error);
			setError("Failed to fetch balance");
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		getBalance();
	}, [wallet.publicKey, connection]);

	if (!wallet.publicKey) {
		return (
			<div className="flex items-center gap-2 text-gray-400">
				<span className="text-sm">Wallet not connected</span>
			</div>
		);
	}

	if (loading) {
		return (
			<div className="flex items-center gap-2">
				<div className="loading-spinner"></div>
				<span className="text-sm text-gray-400">
					Loading balance...
				</span>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center gap-2 text-red-400">
				<span className="text-sm">{error}</span>
				<button
					onClick={getBalance}
					className="text-xs px-2 py-1 bg-red-500/20 rounded hover:bg-red-500/30 transition-colors"
				>
					Retry
				</button>
			</div>
		);
	}

	return (
		<div className="flex items-center gap-2">
			<span className="text-sm text-gray-400">Balance:</span>
			<span className="balance-display text-lg font-bold">
				{balance !== null ? balance.toFixed(4) : "0.0000"} SOL
			</span>
			<button
				onClick={getBalance}
				className="text-xs px-2 py-1 bg-white/10 rounded hover:bg-white/20 transition-colors"
				title="Refresh balance"
			>
				↻
			</button>
		</div>
	);
}
