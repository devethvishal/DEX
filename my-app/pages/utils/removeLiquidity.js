import {BigNumber, utils, Contract, providers, Signer} from 'ethers'
import {EXCHANGE_CONTRACT_ABI,EXCHANGE_CONTRACT_ADDRESS} from '../../constants'

export const removeLiquidity =  async (signer, removeLPTokenAmount) => {
    try {
        const exchangeContract = new Contract(EXCHANGE_CONTRACT_ADDRESS, EXCHANGE_CONTRACT_ABI, signer);
        const tx = await exchangeContract.removeLiquidity(removeLPTokenAmount);
        await tx.wait();
    } catch (err) {
        console.log(err);
    }
}

export const getTokensAfterRemove = async (provider, removeLPTokenAmount, _ethBalance, cdTokenReserve) => {
    try {
        const exchangeContract = new Contract(EXCHANGE_CONTRACT_ADDRESS, EXCHANGE_CONTRACT_ABI, provider);
        const _totalSupply = await exchangeContract.totalSupply();

        const ethReturned = _ethBalance.mul(removeLPTokenAmount).div(_totalSupply);
        const cdTokenReturned = cdTokenReserve.mul(removeLPTokenAmount).div(_totalSupply);

        return {ethReturned, cdTokenReturned};
    } catch (err) {
        console.log(err);
    }
}