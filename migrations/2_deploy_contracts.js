const PFPMEGO = artifacts.require("./PFPMEGO.sol");
const fs = require('fs')

module.exports = async(deployer, network) => {
    const MEGO = process.env.MEGO_ADDRESS
    const PFP = process.env.PFP_ADDRESS
    const GATE = process.env.GATE
    await deployer.deploy(PFPMEGO, MEGO, PFP, GATE);
    const contract = await PFPMEGO.deployed();
    let configs = JSON.parse(fs.readFileSync(process.env.CONFIG).toString())
    console.log('Saving address in config file..')
    configs.contract_address = contract.address
    fs.writeFileSync(process.env.CONFIG, JSON.stringify(configs, null, 4))
    console.log('--')
};