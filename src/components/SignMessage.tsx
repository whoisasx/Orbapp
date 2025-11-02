import { ed25519 } from "@noble/curves/ed25519.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import bs58 from "bs58";
import toast from "react-hot-toast";

export default function SignMessage() {
	const [message, setMessage] = useState("");
	const [signature, setSignature] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const { publicKey, signMessage } = useWallet();

	async function signMessageByUser() {
		if (!publicKey || !signMessage) {
			toast.error(
				"Wallet doesn't support message signing or not connected"
			);
			return;
		}

		if (!message.trim()) {
			toast.error("Please enter a message to sign");
			return;
		}

		setLoading(true);
		setSignature(null);

		try {
			const encodedMessage = new TextEncoder().encode(message);
			const signatureBytes = await signMessage(encodedMessage);

			const verified = ed25519.verify(
				signatureBytes,
				encodedMessage,
				publicKey.toBytes()
			);

			if (verified) {
				const signatureBase58 = bs58.encode(signatureBytes);
				setSignature(signatureBase58);
				toast.success("Message signed successfully!");
			} else {
				toast.error("Message signature verification failed");
			}
		} catch (error: any) {
			console.error("Signing error:", error);
			toast.error(error.message || "Failed to sign message");
		} finally {
			setLoading(false);
		}
	}

	const copySignature = () => {
		if (signature) {
			navigator.clipboard.writeText(signature);
			toast.success("Signature copied to clipboard!");
		}
	};

	const clearMessage = () => {
		setMessage("");
		setSignature(null);
	};

	return (
		<div className="space-y-4">
			<div className="space-y-3">
				<div className="space-y-2">
					<label className="block text-sm font-medium text-gray-300">
						Message to Sign
					</label>
					<textarea
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						placeholder="Enter your message here..."
						className="input-field w-full min-h-20 resize-none"
						disabled={loading}
						maxLength={500}
					/>
					<div className="flex justify-between text-xs text-gray-400">
						<span>{message.length}/500 characters</span>
					</div>
				</div>

				<div className="flex gap-3">
					<button
						className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
						onClick={signMessageByUser}
						disabled={loading || !publicKey || !message.trim()}
					>
						{loading ? (
							<div className="flex items-center justify-center gap-2">
								<div className="loading-spinner"></div>
								<span>Signing...</span>
							</div>
						) : (
							"Sign Message"
						)}
					</button>

					{message && (
						<button
							className="btn-secondary"
							onClick={clearMessage}
							disabled={loading}
						>
							Clear
						</button>
					)}
				</div>
			</div>

			{signature && (
				<div className="space-y-2">
					<label className="block text-sm font-medium text-green-400">
						Signature (Base58)
					</label>
					<div className="relative">
						<div className="input-field w-full font-mono text-xs break-all bg-green-500/10 border-green-500/30 text-green-300">
							{signature}
						</div>
						<button
							onClick={copySignature}
							className="absolute top-2 right-2 text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 transition-colors"
						>
							Copy
						</button>
					</div>
				</div>
			)}

			{!publicKey && (
				<div className="text-center text-sm text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-3">
					Connect your wallet to sign messages
				</div>
			)}
		</div>
	);
}
