const { ethers } = require('ethers');
const fs = require('fs').promises;

const recipientAddress = 'your address';
const providerUrls = [
    'https://mainnet.base.org'
]; //crypto rpc, you can add multiple chains

// Function to get dynamic gas price
async function getGasPrice(provider) {
    try {
        const gasPrice = await provider.getGasPrice();
        return gasPrice;
    } catch (error) {
        console.error('Error fetching gas price:', error);
        throw error;
    }
}

const processChain = async (providerUrl, privateKeys) => {
    let successfulTransfers = 0;
    try {
        const provider = new ethers.providers.JsonRpcProvider(providerUrl);
        const gasPrice = await getGasPrice(provider); // Fetch current gas price dynamically

        for (let i = 0; i < privateKeys.length; i++) {
            const privateKey = privateKeys[i];
            const wallet = new ethers.Wallet(privateKey);
            const balance = await provider.getBalance(wallet.address);
            console.log(`Processing wallet ${i + 1}/${privateKeys.length} on chain ${providerUrl}`);
            console.log(`Balance of ${wallet.address}: ${ethers.utils.formatEther(balance)}`);
            const amountIn = balance.sub(ethers.BigNumber.from('20000000000000'));
            if (amountIn.gt(ethers.BigNumber.from('1'))) {
                const account = wallet.connect(provider);
                console.log(`Sending ${wallet.address}: ${ethers.utils.formatEther(amountIn)}`);
                
                try {
                    const tx = {
                        to: recipientAddress,
                        value: amountIn,
                        gasPrice, // Use dynamic gas price
                        gasLimit: ethers.BigNumber.from('21000') // Set a manual gas limit
                    };
                    
                    const estimate = await provider.estimateGas(tx);
                    tx.gasLimit = estimate;

                    const transferTX = await account.sendTransaction(tx);
                    const receipt = await transferTX.wait();
                    console.log(`Transaction hash: ${receipt.transactionHash}`);
                    successfulTransfers++; // Increment successful transfers counter
                } catch (estimateError) {
                    console.error(`Error estimating gas for ${wallet.address}:`, estimateError);
                }
            }
        }
        console.log(`Total successful transfers on ${providerUrl}: ${successfulTransfers}`);
    } catch (error) {
        console.error('Error on chain:', providerUrl, error);
    }
}

const init = async () => {
    try {
        const privateKeysFile = await fs.readFile('privatekeys.txt', 'utf-8');  //make a file privatekey.txt, each privatekey each line
        const privateKeys = privateKeysFile.trim().split('\n').map(key => key.trim());

        for (const providerUrl of providerUrls) {
            await processChain(providerUrl, privateKeys);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

init();
