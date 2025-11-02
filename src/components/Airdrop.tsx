import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import toast from "react-hot-toast";

export default function Airdrop() {
	const wallet = useWallet();
	const { connection } = useConnection();
	const [amount, setAmount] = useState(1);
	const [loading, setLoading] = useState(false);

	const sendAirdropUser = async () => {
		if (!wallet.publicKey) {
			toast.error("Please connect your wallet first");
			return;
		}

		if (amount <= 0) {
			toast.error("Amount must be greater than 0");
			return;
		}

		if (amount > 5) {
			toast.error("Maximum airdrop amount is 5 SOL");
			return;
		}

		setLoading(true);
		const lamports = amount * LAMPORTS_PER_SOL;

		try {
			const signature = await connection.requestAirdrop(
				wallet.publicKey,
				lamports
			);

			const latestBlockhash = await connection.getLatestBlockhash();
			await connection.confirmTransaction({
				signature,
				blockhash: latestBlockhash.blockhash,
				lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
			});

			toast.success(`Successfully airdropped ${amount} SOL!`);
		} catch (err: any) {
			console.error("Airdrop failed:", err);
			toast.error(err.message || "Airdrop failed. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="space-y-4">
			<div className="space-y-4">
				<div className="space-y-2">
					<label className="block text-sm font-medium text-gray-300">
						Amount (SOL)
					</label>
					<input
						type="number"
						min={0.01}
						max={5}
						step={0.01}
						value={amount}
						onChange={(e) => setAmount(Number(e.target.value))}
						placeholder="Enter amount"
						className="input-field w-full"
						disabled={loading}
					/>
					<p className="text-xs text-gray-400">
						Maximum: 5 SOL per request
					</p>
				</div>

				<button
					className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
					onClick={sendAirdropUser}
					disabled={loading || !wallet.publicKey}
				>
					{loading ? (
						<div className="flex items-center justify-center gap-2">
							<div className="loading-spinner"></div>
							<span>Processing...</span>
						</div>
					) : (
						"Request Airdrop"
					)}
				</button>
			</div>

			{!wallet.publicKey && (
				<div className="text-center text-sm text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-3">
					Connect your wallet to request an airdrop
				</div>
			)}
		</div>
	);
}
