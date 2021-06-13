import predictionsAbi from 'config/abi/predictions.json'
import web3NoAccount from "./web3";
import Web3 from 'web3';
import {getDecimalAmount} from './formatBalance';
import BigNumber from 'bignumber.js'

export const getPredictionsContract = (web3: Web3) => {


    return getContract(predictionsAbi, "0x9cF8051b4D811C20b4CDe2574E71dfBABE4C4FCE", web3)


}

const getContract = (abi: any, address: string, web3?: Web3, account?: string) => {
    const _web3 = web3 ?? web3NoAccount
    const gasPrice = 5
    return new _web3.eth.Contract(abi, address, {
        gasPrice: getGasPriceInWei(gasPrice).toString(),
    })
}


export const getGasPriceInWei = (amountInGwei: number) => {
    return getDecimalAmount(new BigNumber(amountInGwei), 9)
}
