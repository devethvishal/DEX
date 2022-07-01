import { Contract } from "ethers";
import { EXCHANGE_CONTRACT_ADDRESS, EXCHANGE_CONTRACT_ABI, TOKEN_CONTRACT_ADDRESS, TOKEN_CONTRACT_ABI } from "../../constants";

export const getAmountOfTokenReceivedFromSwap = async (_swapAmountWei, provider, ethSelected, _ethBalance, cdTokenReserved) => {
    try {
        const exchangeContract = await Contract(EXCHANGE_CONTRACT_ADDRESS, EXCHANGE_CONTRACT_ABI, provider);
        if(ethSelected) {
            const amount = await exchangeContract.getAmountOfToken(
                _swapAmountWei,
                _ethBalance,
                cdTokenReserved
            );
            return amount;
        } else {
            const amount = await exchangeContract.getAmountOfToken(
                _swapAmountWei,
                cdTokenReserved,
                _ethBalance
            );
            return amount;
        }
    } catch (error) {
        console.log(error);
    }
}



export const swapTokens = async (signer, swapAmountWei, tokenToBeReceivedAfterSwap, ethSelected) => {
    try {
        const exchangeContract = await Contract(EXCHANGE_CONTRACT_ADDRESS, EXCHANGE_CONTRACT_ABI, signer);
        const tokenContract = await Contract (TOKEN_CONTRACT_ADDRESS, TOKEN_CONTRACT_ABI, signer);
        if(ethSelected) {
            const tx = await exchangeContract.ethToCryptoDevToken(tokenToBeReceivedAfterSwap,{
                value: swapAmountWei
            })
        } else {
            let tx = await tokenContract.approve(EXCHANGE_CONTRACT_ADDRESS, swapAmountWei.toString());
            await tx.wait();
            
            tx = await exchangeContract.cryptoDevTokenToEth(swapAmountWei, tokenToBeReceivedAfterSwap);
            await tx.wait();
        }


    } catch (error) {
        console.log(error);
    }
}