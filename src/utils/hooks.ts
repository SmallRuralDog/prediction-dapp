import {useWeb3React} from "@web3-react/core";
import {useRef, useState} from "react";
import {useEffect} from "react";
import {injected} from "./connectors";
import Web3 from "web3";
import {getWeb3NoAccount} from "./web3";
import {Web3Provider} from "@ethersproject/providers";

export function useEagerConnect() {
    const {activate, active} = useWeb3React()

    const [tried, setTried] = useState(false)

    useEffect(() => {
        injected.isAuthorized().then((isAuthorized: boolean) => {
            if (isAuthorized) {
                activate(injected, undefined, true).catch(() => {
                    setTried(true)
                })
            } else {
                setTried(true)
            }
        })
    })

    useEffect(() => {
        if (!tried && active) setTried(true)
    }, [tried, active])

    return tried
}

export function useInactiveListener(suppress: boolean = false) {
    const {active, error, activate} = useWeb3React()

    useEffect(() => {
        // @ts-ignore
        const {ethereum} = window
        if (ethereum && ethereum.on && !active && !error && !suppress) {
            const handleConnect = () => {
                console.log("Handling 'connect' event")
                activate(injected)
            }
            const handleChainChanged = (chainId: string | number) => {
                console.log("Handling 'chainChanged' event with payload", chainId)
                activate(injected)
            }
            const handleAccountsChanged = (accounts: string[]) => {
                console.log("Handling 'accountsChanged' event with payload", accounts)
                if (accounts.length > 0) {
                    activate(injected)
                }
            }
            const handleNetworkChanged = (networkId: string | number) => {
                console.log("Handling 'networkChanged' event with payload", networkId)
                activate(injected)
            }

            ethereum.on('connect', handleConnect)
            ethereum.on('chainChanged', handleChainChanged)
            ethereum.on('accountsChanged', handleAccountsChanged)
            ethereum.on('networkChanged', handleNetworkChanged)

            return () => {
                if (ethereum.removeListener) {
                    ethereum.removeListener('connect', handleConnect)
                    ethereum.removeListener('chainChanged', handleChainChanged)
                    ethereum.removeListener('accountsChanged', handleAccountsChanged)
                    ethereum.removeListener('networkChanged', handleNetworkChanged)
                }
            }
        }
    }, [active, error, suppress, activate])
}

export function useWeb3() {
    const {library} = useWeb3React<Web3Provider>()
    const refEth = useRef(library)
    // @ts-ignore
    const [web3, setWeb3] = useState(library ? new Web3(library.provider) : getWeb3NoAccount())

    useEffect(() => {
        console.log(library)
        if (library !== refEth.current) {
            // @ts-ignore
            setWeb3(library ? new Web3(library.provider) : getWeb3NoAccount())
            refEth.current = library
        }
    }, [library])

    return web3
}
