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
            configs.contract_address, { gasLimit: "2000000" }
        );
        console.log('Testing contract: ' + argv._)
        console.log('--')
        try {
            await nftContract.methods.unlinkName("turinglabs").send({
                from: configs.owner_address
            }).on('transactionHash', tx => {
                console.log('Pending transaction: ' + tx)
            })
            console.log('Name unlinked!')
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