import React, {useState} from 'react';
import {Box, Button} from "@material-ui/core";
import {useWeb3React} from "@web3-react/core";
import {useEagerConnect, useInactiveListener} from "./utils/hooks";
import {injected} from "./utils/connectors";
import Balance from "./components/balance";
import BlockNumber from 'components/block_number';

const App = () => {

    const {error, connector, activate, account, chainId} = useWeb3React()

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

    return (
        <Box>
            {account ? <>
                    <div>
                        <Balance/>
                    </div>

                    <div>
                        <BlockNumber/>
                    </div>
                </> :
                <Button onClick={wallet}>链接钱包</Button>
            }
        </Box>
    );
}


export default App;
