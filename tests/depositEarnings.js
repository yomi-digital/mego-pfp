const HDWalletProvider = require("@truffle/hdwallet-provider");
const web3 = require("web3");
require('dotenv').config()
const argv = require('minimist')(process.argv.slice(2));
const fs = require('fs')
const NFT_CONTRACT_ABI = require('../abi.json')

async function main() {
    try {
        const configs = JSON.parse(fs.readFileSync('./configs/' + argv._ + '.json').toString())
        const provider = new HDWalletProvider(
            configs.owner_mnemonic,
            configs.provider
        );
        const web3Instance = new web3(provider);
        const nftContract = new web3Instance.eth.Contract(
            NFT_CONTRACT_ABI,
            configs.contract_address, {
                gasLimit: "2000000"
            }
        );
        console.log('Testing contract: ' + argv._)
        console.log('--')
        try {
            const paid = await nftContract.methods.paid().call()
            const linked = await nftContract.methods.linked().call()
            const amount = await nftContract.methods.amount().call()
            console.log('Paid: ' + paid)
            console.log('Linked: ' + linked)
            console.log('Reward amount: ' + amount)
            const toSendNumber = linked - paid;
            const toSend = toSendNumber * amount
            console.log('To send: ' + toSendNumber + '(' + toSend + ')')
            if (toSendNumber > 0) {
                await nftContract.methods.depositEarnings().send({
                    from: configs.owner_address,
                    value: toSend
                }).on('transactionHash', tx => {
                    console.log('Pending transaction: ' + tx)
                })
                console.log('Deposit sent!')
            } else {
                console.log('Nothing to deposit')
            }
        } catch (e) {
            console.log(e.message)
        }
        process.exit();
    } catch (e) {
        console.log(e.message)
        process.exit();
    }
}

if (argv._ !== undefined) {
    main();
} else {
    console.log('Provide a deployed contract first.')
}