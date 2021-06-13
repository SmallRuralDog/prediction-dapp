import {useWeb3React} from "@web3-react/core";
import {useEffect, useState} from "react";
import {Web3Provider} from "@ethersproject/providers";
import {formatEther} from '@ethersproject/units'
import {BigNumber} from "@ethersproject/bignumber";

const Balance = () => {
    const {library, account, chainId} = useWeb3React<Web3Provider>()

    const [balance, setBalance] = useState<BigNumber>()

    useEffect(() => {
        if (!account) return

        let stale = false;

        // @ts-ignore
        library.getBalance(account).then((balance: BigNumber) => {
            if (!stale) setBalance(balance)
        }).catch(() => {
            if (!stale) setBalance(undefined)
        })

        return () => {
            stale = true
            setBalance(undefined)
        }

    }, [account, library, chainId])

    return (
        <>{balance === null ? "" : balance ? `${formatEther(balance)}` : ""}</>
    )
}

export default Balance
