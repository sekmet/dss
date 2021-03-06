const { Harmony } = require("@harmony-js/core");
const { ChainID, ChainType } = require("@harmony-js/utils");
const { toUtf8Bytes } = require("@harmony-js/contract");
const { hexlify } = require("@harmony-js/crypto");
var args = process.argv.slice(2);
if (args.length != 3) {
  console.log("Usage: node scripts/generate_dai.js <network(localnet|testnet|mainnet)> <addr> <dai>");
  process.exit(1);
}
var config = require('../../config.json')[`${args[0]}`];
const hmy = new Harmony(
    config.url,
    {
      chainType: ChainType.Harmony,
      chainId: config.chainid,
    }
  );
const addr = args[1];
const daiAmount = parseInt(args[2], 10);

let options2 = { gasPrice: 1000000000, gasLimit: 6721900 };

const allJson = require("../../out/dapp.sol.json");

// dai contract run by admin to mint dai
let daiJoinContract = hmy.contracts.createContract(
  JSON.parse(allJson.contracts["src/join.sol:DaiJoin"].abi),
  process.env.DAIJOIN
);
daiJoinContract.wallet.addByPrivateKey(process.env.PRIVATE_KEY_USER);

let vatContract = hmy.contracts.createContract(
  JSON.parse(allJson.contracts["src/vat.sol:Vat"].abi),
  process.env.VAT
);

var ilk = hexlify(toUtf8Bytes("HarmonyERC20"));

(async function() {
  let res = await vatContract.methods.frob(ilk, addr, addr, addr, 0, daiAmount).send(options2);
  console.log(res);
  res = await vatContract.methods.hope(process.env.DAIJOIN).send(options2);
  console.log(res);
  res = await daiJoinContract.methods.exit(addr, daiAmount).send(options2);
  console.log(res);
  process.exit(0);
})();

// (async function() {
  // gemContract.wallet.setSigner(process.env.ADMIN);
  // let res = await gemContract.methods["approve(address,uint256)"](process.env.GEMJOIN, gemAmount).send(options2);
  // console.log(res);
  // gemJoinContract.wallet.setSigner(process.env.USER);
  // res = await gemJoinContract.methods.join(addr, gemAmount).send(options2);
  // console.log(res);
  // vatContract.wallet.setSigner(process.env.USER);
  // let res = await vatContract.methods.frob(ilk, addr, addr, addr, gemAmount, daiAmount).send(options2);
  // let res = await vatContract.methods.init(ilk).send(options2);
  // let res = await vatContract.methods.wards(process.env.ADMIN).call(options2);
  
  // daiJoinContract.wallet.setSigner(process.env.USER);
  // vatContract.wallet.setSigner(process.env.USER);
  // let res = await daiContract.methods.rely(process.env.DAIJOIN).send(options2);
  // console.log(daiJoinContract.wallet.signer);
  // let res = await vatContract.methods.hope(process.env.DAIJOIN).send(options2);
  // let res = await daiJoinContract.methods.exit(addr, daiAmount).send(options2);
  
  // console.log(res);
  // res = await vatContract.methods.gem(ilk, addr).call(options2);
  // console.log(res.toString());
  // res = await vatContract.methods.dai(addr).call(options2);
  // console.log(res.toString());
// user need to approve gemjoin contract to withdraw gems
// gemContract.methods["approve(address,uint256)"](process.env.GEMJOIN, gemAmount)
//   .send(options2)
//   .then((response) => {
//     if (response.transaction.txStatus == "REJECTED") {
//       console.log("Reject");
//       process.exit(0);
//     }
//     console.log(response.transaction.receipt);
//     // collateralize gems by joining
//     gemJoinContract.methods
//       .join(addr, gemAmount)
//       .send(options2)
//       .then((response) => {
//         if (response.transaction.txStatus == "REJECTED") {
//           console.log("Reject");
//           process.exit(0);
//         }
//         console.log(response);
        // finally fund dai that was requested
        // daiContract.wallet.setSigner(process.env.ADMIN);
        // daiContract.methods["mint(address,uint256)"](addr, daiAmount)
        //   .send(options2)
        //   .then((response) => {
        //     if (response.transaction.txStatus == "REJECTED") {
        //       console.log("Reject");
        //       process.exit(0);
        //     }
        //     console.log(response.transaction.receipt);
        //     process.exit(0);
        //   });
        // daiJoinContract.wallet.setSigner(process.env.USER);
        // vatContract.wallet.setSigner(process.env.USER);
        // let res = await daiContract.methods.rely(process.env.DAIJOIN).send(options2);
        // console.log(daiJoinContract.wallet.signer);
        // let res = await vatContract.methods.hope(process.env.DAIJOIN).send(options2);
        // res = await daiJoinContract.methods.exit(addr, daiAmount).send(options2);
        // console.log(res);
        // process.exit(0);
        // daiJoinContract.methods
        //   .exit(addr, daiAmount)
        //   .send(options2)
        //   .then((response) => {
        //     if (response.transaction.txStatus == "REJECTED") {
        //       console.log("Reject");
        //       process.exit(0);
        //     }
        //     console.log(response);
        //   });
  //     });
  // });
// });
