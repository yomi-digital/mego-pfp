const fs = require('fs')
const child_process = require('child_process')

async function ganache() {
    try {
        const configs = JSON.parse(fs.readFileSync('./configs/ganache.json').toString())
        if (
            configs.network !== undefined &&
            configs.network === 'ganache' &&
            configs.owner_mnemonic !== undefined
        ) {

            console.log('Running ganache..')
            child_process.execSync('ganache --wallet.mnemonic "' + configs.owner_mnemonic + '"', { stdio: 'inherit' })
        } else {
            console.log('Config file missing.')
        }
    } catch (e) {
        console.log(e.message)
        process.exit()
    }
}

ganache();