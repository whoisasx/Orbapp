# 🚀 Solana Wallet dApp

A modern, responsive Solana wallet application built with React, TypeScript, and Vite. This comprehensive dApp provides a complete set of tools for interacting with the Solana blockchain, including wallet management, token operations, and transaction handling.

![Solana Wallet](https://img.shields.io/badge/Solana-Wallet-9945FF?style=for-the-badge&logo=solana&logoColor=white)
![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Latest-646CFF?style=for-the-badge&logo=vite&logoColor=white)

## ✨ Features

### 🎨 **User Interface**

-   **Modern Design**: Glassmorphism UI with smooth animations
-   **Dark/Light Theme**: Toggle between themes with persistent storage
-   **Responsive Layout**: Mobile-first design that works on all devices
-   **Real-time Updates**: Live balance updates and transaction status
-   **Toast Notifications**: User-friendly feedback for all operations

### 🔗 **Wallet Integration**

-   **Multi-Wallet Support**: Compatible with popular Solana wallets
-   **Auto-Connect**: Remembers wallet preference
-   **Secure Connection**: Safe wallet interaction using official adapters
-   **Balance Display**: Real-time SOL balance with refresh functionality

### 💰 **Core Functionality**

#### **1. Airdrop SOL**

-   Request devnet SOL for testing
-   Amount validation (max 5 SOL per request)
-   Transaction confirmation with proper error handling
-   Loading states and success feedback

#### **2. Send SOL**

-   Transfer SOL to any Solana address
-   Address validation and balance checking
-   Transaction confirmation and status tracking
-   Comprehensive error handling

#### **3. Message Signing**

-   Sign arbitrary messages with your wallet
-   Signature verification using ed25519
-   Base58 encoded signature display
-   Copy signature functionality

#### **4. Token Creation (Token-2022)**

-   Create custom tokens with metadata
-   Icon selection and customization
-   Form validation and character limits
-   Initial supply configuration
-   Token-2022 standard compliance

#### **5. Token Management**

-   View all Token-2022 tokens in your wallet
-   Display token balances and metadata
-   Copy mint addresses
-   Beautiful card-based token display

## 🛠️ Tech Stack

### **Frontend**

-   **React 19+** - Modern React with latest features
-   **TypeScript** - Type-safe development
-   **Vite** - Fast build tool and dev server
-   **Tailwind CSS** - Utility-first CSS framework

### **Solana Integration**

-   **@solana/web3.js** - Core Solana JavaScript SDK
-   **@solana/wallet-adapter-react** - React wallet integration
-   **@solana/spl-token** - SPL Token operations
-   **@solana/spl-token-metadata** - Token metadata handling

### **UI/UX Libraries**

-   **react-hot-toast** - Beautiful notifications
-   **react-icons** - Icon library
-   **@noble/curves** - Cryptographic operations

## 🚀 Getting Started

### Prerequisites

-   Node.js 18+ or Bun
-   A Solana wallet (Phantom, Solflare, etc.)

### Installation

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd solana-wallet-dapp
    ```

2. **Install dependencies**

    ```bash
    # Using npm
    npm install

    # Using bun (recommended)
    bun install
    ```

3. **Start the development server**

    ```bash
    # Using npm
    npm run dev

    # Using bun
    bun dev
    ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
# Using npm
npm run build

# Using bun
bun run build
```

## 🎯 Usage Guide

### **1. Connect Your Wallet**

-   Click the "Select Wallet" button in the header
-   Choose your preferred Solana wallet
-   Approve the connection request

### **2. Check Your Balance**

-   Your SOL balance appears in the header
-   Click the refresh button (↻) to update manually
-   Balance updates automatically after transactions

### **3. Request Airdrop**

-   Enter the amount of SOL you want (max 5 SOL)
-   Click "Request Airdrop"
-   Wait for transaction confirmation

### **4. Send SOL**

-   Enter the recipient's wallet address
-   Specify the amount to send
-   Click "Send SOL" and confirm in your wallet

### **5. Sign Messages**

-   Type your message in the text area
-   Click "Sign Message"
-   Your signature will be displayed and can be copied

### **6. Create Tokens**

-   Fill in token name and symbol
-   Set the initial supply
-   Choose an icon for your token
-   Click "Create Token" and confirm the transaction

### **7. View Your Tokens**

-   Click "Refresh Tokens" to load your Token-2022 tokens
-   View balances and copy mint addresses
-   See all token metadata

## 🎨 Theme System

The app features a comprehensive theme system:

-   **Dark Theme**: Professional dark interface with blue gradients
-   **Light Theme**: Clean light interface with high contrast
-   **Persistent Storage**: Your theme preference is saved
-   **Smooth Transitions**: Seamless switching between themes

## 🔧 Configuration

### **Network Settings**

The app is configured for Solana Devnet by default. To change networks:

1. Edit `src/providers/SolanaProviders.tsx`
2. Change the `network` variable:
    ```typescript
    const network = WalletAdapterNetwork.Devnet; // or Testnet, Mainnet
    ```

### **RPC Endpoint**

To use a custom RPC endpoint, uncomment the custom endpoint in `SolanaProviders.tsx`:

```typescript
endpoint: "https://your-custom-rpc-endpoint.com";
```

## 📱 Responsive Design

The application is built with mobile-first responsive design:

-   **Mobile**: Single column layout with stacked components
-   **Tablet**: Optimized spacing and touch-friendly interactions
-   **Desktop**: Two-column grid layout for maximum efficiency

## 🔒 Security Features

-   **No Private Key Storage**: Uses wallet adapters for secure transactions
-   **Transaction Validation**: All inputs are validated before submission
-   **Error Handling**: Comprehensive error handling and user feedback
-   **Network Verification**: Proper transaction confirmation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

-   [Solana Documentation](https://docs.solana.com/)
-   [Solana Web3.js](https://solana-labs.github.io/solana-web3.js/)
-   [Token-2022 Program](https://spl.solana.com/token-2022)
-   [Wallet Adapter](https://github.com/solana-labs/wallet-adapter)

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Join the [Solana Discord](https://discord.gg/solana) for community support

---

Built with ❤️ for the Solana ecosystem
