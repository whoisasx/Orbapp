import { TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface TokenAccount {
	mint: string;
	amount: string;
	decimals: number;
	uiAmount: number | null;
}

export default function Tokenlist() {
	const { publicKey } = useWallet();
	const { connection } = useConnection();
	const [tokens, setTokens] = useState<TokenAccount[]>([]);
	const [loading, setLoading] = useState(false);

	async function getAllTokens() {
		if (!publicKey) {
			toast.error("Please connect your wallet first");
			return;
		}

		setLoading(true);
		try {
			const response = await connection.getParsedTokenAccountsByOwner(
				publicKey,
				{
					programId: TOKEN_2022_PROGRAM_ID,
				}
			);

			const tokenAccounts: TokenAccount[] = response.value.map(
				(account) => ({
					mint: account.account.data.parsed.info.mint,
					amount: account.account.data.parsed.info.tokenAmount.amount,
					decimals:
						account.account.data.parsed.info.tokenAmount.decimals,
					uiAmount:
						account.account.data.parsed.info.tokenAmount.uiAmount,
				})
			);

			setTokens(tokenAccounts);

			if (tokenAccounts.length === 0) {
				toast("No Token-2022 tokens found in your wallet", {
					icon: "ℹ️",
				});
			} else {
				toast.success(`Found ${tokenAccounts.length} token(s)`);
			}
		} catch (error: any) {
			console.error("Error fetching tokens:", error);
			toast.error("Failed to fetch tokens. Please try again.");
		} finally {
			setLoading(false);
		}
	}

	const copyMintAddress = (mint: string) => {
		navigator.clipboard.writeText(mint);
		toast.success("Mint address copied to clipboard!");
	};

	const formatAmount = (amount: string, decimals: number) => {
		const num = parseInt(amount) / Math.pow(10, decimals);
		return num.toLocaleString(undefined, {
			maximumFractionDigits: decimals,
		});
	};

	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center">
				<h3 className="text-lg font-medium text-gray-300">
					Token-2022 Tokens
				</h3>
				<button
					className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
					onClick={getAllTokens}
					disabled={loading || !publicKey}
				>
					{loading ? (
						<div className="flex items-center gap-2">
							<div className="loading-spinner"></div>
							<span>Loading...</span>
						</div>
					) : (
						"Refresh Tokens"
					)}
				</button>
			</div>

			{!publicKey && (
				<div className="text-center text-sm text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-3">
					Connect your wallet to view your tokens
				</div>
			)}

			{tokens.length === 0 && publicKey && !loading && (
				<div className="text-center py-8">
					<div className="text-4xl mb-2">🪙</div>
					<p className="text-gray-400 text-sm">
						No tokens found. Create your first token!
					</p>
				</div>
			)}

			{tokens.length > 0 && (
				<div className="space-y-3">
					{tokens.map((token, index) => (
						<div
							key={token.mint}
							className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors"
						>
							<div className="flex justify-between items-start mb-3">
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
										{index + 1}
									</div>
									<div>
										<h4 className="font-medium text-white">
											Token #{index + 1}
										</h4>
										<p className="text-xs text-gray-400">
											Custom Token
										</p>
									</div>
								</div>
								<div className="text-right">
									<p className="text-lg font-bold text-white">
										{token.uiAmount !== null
											? token.uiAmount.toLocaleString()
											: formatAmount(
													token.amount,
													token.decimals
											  )}
									</p>
									<p className="text-xs text-gray-400">
										Balance
									</p>
								</div>
							</div>

							<div className="space-y-2">
								<div>
									<p className="text-xs text-gray-400 mb-1">
										Mint Address:
									</p>
									<div className="flex items-center gap-2">
										<code className="text-xs font-mono bg-black/30 px-2 py-1 rounded text-gray-300 flex-1 break-all">
											{token.mint}
										</code>
										<button
											onClick={() =>
												copyMintAddress(token.mint)
											}
											className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition-colors whitespace-nowrap"
										>
											Copy
										</button>
									</div>
								</div>

								<div className="grid grid-cols-2 gap-4 text-xs">
									<div>
										<p className="text-gray-400">
											Raw Amount:
										</p>
										<p className="font-mono text-gray-300">
											{token.amount}
										</p>
									</div>
									<div>
										<p className="text-gray-400">
											Decimals:
										</p>
										<p className="font-mono text-gray-300">
											{token.decimals}
										</p>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
