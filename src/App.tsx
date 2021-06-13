import React, {useState} from 'react';
import {Box, Button} from "@material-ui/core";
import {useWeb3React} from "@web3-react/core";
import {useEagerConnect, useInactiveListener, useWeb3} from "./utils/hooks";
import {injected} from "./utils/connectors";
import Balance from "./components/balance";
import BlockNumber from 'components/block_number';
import {getPredictionsContract} from "./utils/contractHelpers";
import {getDecimalAmount} from 'utils/formatBalance';
import BigNumber from "bignumber.js";

const App = () => {

    const {error, connector, activate, account, chainId, library} = useWeb3React()
    const web3 = useWeb3()

    const [activatingConnector, setActivatingConnector] = useState<any>()

    React.useEffect(() => {
        if (activatingConnector && activatingConnector === connector) {
            setActivatingConnector(undefined)
        }
    }, [activatingConnector, connector])

    const triedEager = useEagerConnect()

    useInactiveListener(!triedEager || !!activatingConnector)

    const wallet = async () => {
        setActivatingConnector(injected)
        await activate(injected)
    }

    const cz = async () => {
        const {methods} = getPredictionsContract(web3)

        const valueAsBn = new BigNumber(0.01)

        const decimalValue = getDecimalAmount(valueAsBn)


        methods.betBull().send({from: account, value: decimalValue}).once('error', (error: any) => {
            console.error("errorMsg", error)
        })

    }

    return (
        <Box>
            {account ? <>
                    <div>
                        <Balance/>
                    </div>

                    <div>
                        <BlockNumber/>
                    </div>
                    <div>
                        <Button onClick={cz}>猜涨</Button>
                    </div>
                </> :
                <Button onClick={wallet}>链接钱包</Button>
            }
        </Box>
    );
}


export default App;
