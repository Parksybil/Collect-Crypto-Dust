
# Collect Crypto Dust Script

This script processes Ethereum and Layer 2 (L2) transactions for multiple wallets, sending funds to a specified recipient address. It fetches the current gas price dynamically and adjusts the gas limit based on the transaction estimation.


## Prerequisites

- Node.js (version 14 or later)
- NPM (Node Package Manager)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/parlsybil/Collect-Crypto-Dust.git
cd Collect-Crypto-Dust
// Install the dependencies:

npm install

Create a file named privatekeys.txt in the root directory of the project. Each private key should be on a new line.

Replace 'your address' in index.js with the recipient address.

Usage

Run the script using the following command:

node index.js
