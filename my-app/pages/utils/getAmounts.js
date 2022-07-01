import {Contract} from 'ethers'

import {EXCHANGE_CONTRACT_ABI,EXCHANGE_CONTRACT_ADDRESS,TOKEN_CONTRACT_ADDRESS,TOKEN_CONTRACT_ABI} from '../../constants'

export const getEtherBalance = async (provider, address, contract = false) => {
    try {
        if(contract){
            const amount = await provider.getBalance(EXCHANGE_CONTRACT_ADDRESS);
            return amount;
        } else {
            const amount = await provider.getBalance(address);
            return amount;
        }
    } catch (err) {
        console.log(err);
    }
}

export const getCDTokensBalance = async (provider, address) => {
    try {
        const tokenContract = new Contract(TOKEN_CONTRACT_ADDRESS, TOKEN_CONTRACT_ABI, provider);
        const amount = await tokenContract.balanceOf(address);
        return amount;
    } catch (err) {
        console.log(err);
    }
}

export const getLPTokensBalance = async (provider, address) => {
    try {
        const exchangeContract = new Contract(EXCHANGE_CONTRACT_ADDRESS, EXCHANGE_CONTRACT_ABI, provider);
        const amount = await exchangeContract.balanceOf(address);
        return amount;
    } catch (err) {
        console.log(err);
    }
}


export const getReserveOfCDTokens = async (provider) => {
    try {
        const exchangeContract = new Contract(EXCHANGE_CONTRACT_ADDRESS, EXCHANGE_CONTRACT_ABI, provider);
        const tokenReserve = await exchangeContract.getReserve();   
        return tokenReserve;    
    } catch (err) {
        console.log(err);
    }
}