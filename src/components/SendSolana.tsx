import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
	LAMPORTS_PER_SOL,
	PublicKey,
	SystemProgram,
	Transaction,
} from "@solana/web3.js";
import { useState } from "react";
import toast from "react-hot-toast";

export default function SendSolana() {
	const [amount, setAmount] = useState(0.1);
	const [to, setTo] = useState("");
	const [loading, setLoading] = useState(false);

	const wallet = useWallet();
	const { connection } = useConnection();

	const validateAddress = (address: string): boolean => {
		try {
			new PublicKey(address);
			return true;
		} catch {
			return false;
		}
	};

	async function sendSolanaToUser() {
		if (!wallet.publicKey) {
			toast.error("Please connect your wallet first");
			return;
		}

		if (!to.trim()) {
			toast.error("Please enter a recipient address");
			return;
		}

		if (!validateAddress(to)) {
			toast.error("Invalid Solana address");
			return;
		}

		if (amount <= 0) {
			toast.error("Amount must be greater than 0");
			return;
		}

		setLoading(true);

		try {
			const balance = await connection.getBalance(wallet.publicKey);
			const requiredLamports = amount * LAMPORTS_PER_SOL;
			const estimatedFee = 5000;

			if (balance < requiredLamports + estimatedFee) {
				toast.error("Insufficient balance for this transaction");
				return;
			}

			const transaction = new Transaction();
			transaction.add(
				SystemProgram.transfer({
					fromPubkey: wallet.publicKey,
					toPubkey: new PublicKey(to),
					lamports: requiredLamports,
				})
			);

			const signature = await wallet.sendTransaction(
				transaction,
				connection
			);
			await connection.confirmTransaction(signature);

			toast.success(`Successfully sent ${amount} SOL!`);
			setTo("");
			setAmount(0.1);
		} catch (error: any) {
			console.error("Transaction failed:", error);
			toast.error(
				error.message || "Transaction failed. Please try again."
			);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="space-y-4">
			<div className="space-y-3">
				<div className="space-y-2">
					<label className="block text-sm font-medium text-gray-300">
						Recipient Address
					</label>
					<input
						type="text"
						value={to}
						onChange={(e) => setTo(e.target.value)}
						placeholder="Enter Solana wallet address"
						className="input-field w-full"
						disabled={loading}
					/>
					{to && !validateAddress(to) && (
						<p className="text-xs text-red-400">
							Invalid Solana address format
						</p>
					)}
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<div className="space-y-2">
						<label className="block text-sm font-medium text-gray-300">
							Amount (SOL)
						</label>
						<input
							type="number"
							min={0.01}
							step={0.01}
							value={amount}
							onChange={(e) => setAmount(Number(e.target.value))}
							placeholder="0.00"
							className="input-field w-full"
							disabled={loading}
						/>
					</div>

					<div className="flex items-end">
						<button
							className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
							onClick={sendSolanaToUser}
							disabled={
								loading ||
								!wallet.publicKey ||
								!to.trim() ||
								!validateAddress(to)
							}
						>
							{loading ? (
								<div className="flex items-center justify-center gap-2">
									<div className="loading-spinner"></div>
									<span>Sending...</span>
								</div>
							) : (
								"Send SOL"
							)}
						</button>
					</div>
				</div>
			</div>

			{!wallet.publicKey && (
				<div className="text-center text-sm text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-3">
					Connect your wallet to send SOL
				</div>
			)}
		</div>
	);
}
