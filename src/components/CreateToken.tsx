import {
	createAssociatedTokenAccountInstruction,
	createInitializeMetadataPointerInstruction,
	createInitializeMintInstruction,
	createMintToInstruction,
	ExtensionType,
	getAssociatedTokenAddress,
	getMintLen,
	LENGTH_SIZE,
	TOKEN_2022_PROGRAM_ID,
	TYPE_SIZE,
} from "@solana/spl-token";
import {
	createInitializeInstruction as createInitializeMetadataInstruction,
	pack,
	type TokenMetadata,
} from "@solana/spl-token-metadata";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { useState } from "react";
import toast from "react-hot-toast";

export default function CreateToken() {
	const [tokenName, setTokenName] = useState("");
	const [tokenSymbol, setTokenSymbol] = useState("");
	const [amount, setAmount] = useState(100);
	const [selectedIcon, setSelectedIcon] = useState("");
	const [loading, setLoading] = useState(false);

	const { connection } = useConnection();
	const { publicKey, signTransaction } = useWallet();

	const icons = [
		{ id: "default", name: "Default", emoji: "🪙" },
		{ id: "fire", name: "Fire", emoji: "🔥" },
		{ id: "diamond", name: "Diamond", emoji: "💎" },
		{ id: "rocket", name: "Rocket", emoji: "🚀" },
		{ id: "star", name: "Star", emoji: "⭐" },
		{ id: "lightning", name: "Lightning", emoji: "⚡" },
	];

	const validateForm = () => {
		if (!tokenName.trim()) {
			toast.error("Token name is required");
			return false;
		}
		if (!tokenSymbol.trim()) {
			toast.error("Token symbol is required");
			return false;
		}
		if (tokenName.length > 20) {
			toast.error("Token name must be 20 characters or less");
			return false;
		}
		if (tokenSymbol.length > 6) {
			toast.error("Token symbol must be 6 characters or less");
			return false;
		}
		if (amount < 1) {
			toast.error("Initial supply must be at least 1");
			return false;
		}
		return true;
	};

	async function createToken() {
		if (!publicKey || !signTransaction) {
			toast.error("Please connect your wallet first");
			return;
		}

		if (!validateForm()) {
			return;
		}

		setLoading(true);

		try {
			const mintKeypair = Keypair.generate();
			const metadata: TokenMetadata = {
				updateAuthority: publicKey,
				mint: mintKeypair.publicKey,
				name: tokenName,
				symbol: tokenSymbol,
				uri: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
				additionalMetadata: [
					[
						"description",
						`${tokenName} - Created with Solana Token Creator`,
					],
					["icon", selectedIcon || "default"],
				],
			};

			const extensions = [ExtensionType.MetadataPointer];
			const mintLen = getMintLen(extensions);
			const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;
			const totalSpace = mintLen + metadataLen;
			const lamports = await connection.getMinimumBalanceForRentExemption(
				totalSpace
			);

			const createMintAccountIx = SystemProgram.createAccount({
				fromPubkey: publicKey,
				newAccountPubkey: mintKeypair.publicKey,
				space: mintLen,
				lamports,
				programId: TOKEN_2022_PROGRAM_ID,
			});

			const initMetadataPointerIx =
				createInitializeMetadataPointerInstruction(
					mintKeypair.publicKey,
					publicKey,
					mintKeypair.publicKey,
					TOKEN_2022_PROGRAM_ID
				);

			const initMintIx = createInitializeMintInstruction(
				mintKeypair.publicKey,
				9,
				publicKey,
				null,
				TOKEN_2022_PROGRAM_ID
			);

			const initMetaIx = createInitializeMetadataInstruction({
				metadata: mintKeypair.publicKey,
				updateAuthority: metadata.updateAuthority!,
				mint: metadata.mint,
				mintAuthority: publicKey,
				name: metadata.name,
				symbol: metadata.symbol,
				uri: metadata.uri,
				programId: TOKEN_2022_PROGRAM_ID,
			});

			const tokenAccount = await getAssociatedTokenAddress(
				mintKeypair.publicKey,
				publicKey,
				false,
				TOKEN_2022_PROGRAM_ID
			);

			const createTokenAccountIx =
				createAssociatedTokenAccountInstruction(
					publicKey,
					tokenAccount,
					publicKey,
					mintKeypair.publicKey,
					TOKEN_2022_PROGRAM_ID
				);

			const initialSupply = amount * Math.pow(10, 9);
			const mintToIx = createMintToInstruction(
				mintKeypair.publicKey,
				tokenAccount,
				publicKey,
				initialSupply,
				[],
				TOKEN_2022_PROGRAM_ID
			);

			const tx = new Transaction().add(
				createMintAccountIx,
				initMetadataPointerIx,
				initMintIx,
				initMetaIx,
				createTokenAccountIx,
				mintToIx
			);

			tx.feePayer = publicKey;
			tx.recentBlockhash = (
				await connection.getLatestBlockhash()
			).blockhash;
			tx.partialSign(mintKeypair);

			const signedTx = await signTransaction(tx);
			const txid = await connection.sendRawTransaction(
				signedTx.serialize()
			);

			const latestBlockhash = await connection.getLatestBlockhash();
			await connection.confirmTransaction(
				{
					signature: txid,
					blockhash: latestBlockhash.blockhash,
					lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
				},
				"confirmed"
			);

			toast.success("Token created successfully!");
			console.log("Mint address:", mintKeypair.publicKey.toString());
			console.log("Token account:", tokenAccount.toString());
			console.log("Transaction ID:", txid);

			// Reset form
			setTokenName("");
			setTokenSymbol("");
			setAmount(100);
			setSelectedIcon("");
		} catch (error: any) {
			console.error("Token creation error:", error);
			toast.error(
				error.message || "Failed to create token. Please try again."
			);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="space-y-2">
					<label className="block text-sm font-medium text-gray-300">
						Token Name
					</label>
					<input
						type="text"
						value={tokenName}
						maxLength={20}
						onChange={(e) => setTokenName(e.target.value)}
						placeholder="Enter token name"
						className="input-field w-full"
						disabled={loading}
					/>
					<p className="text-xs text-gray-400">
						{tokenName.length}/20 characters
					</p>
				</div>

				<div className="space-y-2">
					<label className="block text-sm font-medium text-gray-300">
						Token Symbol
					</label>
					<input
						type="text"
						value={tokenSymbol}
						maxLength={6}
						onChange={(e) =>
							setTokenSymbol(e.target.value.toUpperCase())
						}
						placeholder="Enter symbol"
						className="input-field w-full"
						disabled={loading}
					/>
					<p className="text-xs text-gray-400">
						{tokenSymbol.length}/6 characters
					</p>
				</div>
			</div>

			<div className="space-y-2">
				<label className="block text-sm font-medium text-gray-300">
					Initial Supply
				</label>
				<input
					type="number"
					min={1}
					value={amount}
					onChange={(e) => setAmount(Number(e.target.value))}
					placeholder="Enter initial supply"
					className="input-field w-full"
					disabled={loading}
				/>
			</div>

			<div className="space-y-3">
				<label className="block text-sm font-medium text-gray-300">
					Select Icon
				</label>
				<div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
					{icons.map((icon) => (
						<button
							key={icon.id}
							type="button"
							onClick={() => setSelectedIcon(icon.id)}
							className={`p-3 rounded-xl border-2 transition-all duration-200 ${
								selectedIcon === icon.id
									? "border-blue-500 bg-blue-500/20"
									: "border-gray-600 bg-gray-700/50 hover:border-gray-500"
							}`}
							disabled={loading}
						>
							<div className="text-2xl mb-1">{icon.emoji}</div>
							<div className="text-xs text-gray-300">
								{icon.name}
							</div>
						</button>
					))}
				</div>
			</div>

			<button
				className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
				onClick={createToken}
				disabled={loading || !publicKey}
			>
				{loading ? (
					<div className="flex items-center justify-center gap-2">
						<div className="loading-spinner"></div>
						<span>Creating Token...</span>
					</div>
				) : (
					"Create Token"
				)}
			</button>

			{!publicKey && (
				<div className="text-center text-sm text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-3">
					Connect your wallet to create a token
				</div>
			)}
		</div>
	);
}
