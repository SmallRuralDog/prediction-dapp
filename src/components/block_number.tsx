import {useWeb3React} from "@web3-react/core";
import {Web3Provider} from "@ethersproject/providers";
import {useEffect, useState} from "react";

const BlockNumber = () => {
    const {library, chainId} = useWeb3React<Web3Provider>()


    const [blockNumber, setBlockNumber] = useState<number>()

    useEffect(() => {
        if (!!library) {

            let stale = false
            library.getBlockNumber().then((blockNumber: number) => {
                if (!stale) setBlockNumber(blockNumber)
            }).catch(() => {
                if (!stale) setBlockNumber(undefined)
            })

            const updateBlockNumber = (blockNumber: number) => {
                setBlockNumber(blockNumber)
            }

            library.on("block", updateBlockNumber)

            return () => {
                stale = true
                library.removeListener("block", updateBlockNumber)
                setBlockNumber(undefined)
            }

        }
    }, [chainId, library])


    return (
        <>
            {blockNumber === null ? 'Error' : blockNumber ?? ''}
        </>
    )

}

export default BlockNumber
