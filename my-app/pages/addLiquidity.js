import { Contract, providers, Signer, utils } from "ethers";
import {
  EXCHANGE_CONTRACT_ABI,
  EXCHANGE_CONTRACT_ADDRESS,
  TOKEN_CONTRACT_ABI,
  TOKEN_CONTRACT_ADDRESS,
} from "../constants";


 const addLiquidity = async (signer, addCDToken, addEth) => {
    try {
        const tokenContract = await Contract(TOKEN_CONTRACT_ADDRESS, TOKEN_CONTRACT_ABI, signer);
        const exchangeContract = await Contract(EXCHANGE_CONTRACT_ADDRESS, EXCHANGE_CONTRACT_ABI, signer);
        let tx = await tokenContract.approve(EXCHANGE_CONTRACT_ADDRESS,addCDToken.toString());
        await tx.wait();
        tx = await exchangeContract.addLiquidity(addCDToken,{value: addEth});
        await tx.wait();
    } catch (err) {
        console.log(err)
    }
 }

 export const calculateCD = async (addEth, ethReserve, tokenReserve) => {
    try {
        const addEthAmountInWei = utils.parseEther(addEth);
        const tokenAmountToAdd = tokenReserve.mul(addEthAmountInWei).div(ethReserve);
        return tokenAmountToAdd;
    } catch (err) {
        console.log(err);
    }
 }
