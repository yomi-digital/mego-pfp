# MEGO (Previously PolygonME) - PFP extension

This is an example on how to use MEGO in other contracts, MEGO is a composable identity provider based on NFT and fully on-chain.
In this case we're extending it with PFP (Profile Picture), so we'll be able to attach names to other nfts. 

This can be very useful if we want to enhance the experience of profile picture nfts, actually customizing it with amazing names.

## Smart Contract

Smart contract is simple enough to be read and we'll focus on the core concepts behind it. You can find the contract in `contracts` folder.

### Importing MEGO

First of all we must import the interface of MEGO, which can be found in `interfaces` folder:

```
import "../interfaces/IMEGO.sol";
```

After the import we must a variable to instantiate the contract:

```
IMEGO private _mego;
```

And, at the end, we must pass to the constructor the correct contract address:

```
constructor (address MEGO) {
    _mego = IMEGO(MEGO);
}
```

We're now ready to read from main contract!

## Deploy and make tests

If you want to deploy this contract you must create a `configs` folder adding a json file for a specified network, let's say `ganache` with this content:

```
{
    "network": "ganache",
    "contract_address": "",
    "owner_mnemonic": "YourMnemonic",
    "owner_address": "OwnerAddress",
    "me_address": "MEAddress",
    "provider": "http://localhost:7545"
}
```

After we've created it we'll be able to run the deploy with:

```
npm run deploy ganache
```

This script will call the native `truffle` compilation, will extract the address of the contract inserting in our `ganache.json` file and will extract the `abi.json` file automatically.

After we've deployed our contract we'll be able to run tests:

```
npm run test:add ganache
```

This test will check if the name exists (turinglabs.dao), we'll create a new PGP key with `openpgp` module and will write it into the contract in form of `hexadecimal` string.

Then it will retrieve it from the contract and will encrypt a message (Hello, World!) with specified key.

Done!
