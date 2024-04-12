import React, { useEffect, useState } from 'react';
import { useAuthorize } from '@deriv/api-v2';
import useAPI from '@deriv/api-v2/src/useAPI';
import './DepositFiat.scss';
import aggreegatedSubscribe from '@deriv/api-v2/src/lightweightApi/aggregatedSubscribe';


const DepositFiat = () => {
    const { isSuccess: isAuthorizeSuccess } = useAuthorize();
    const { connection } = useAPI();

    const [someData, setSomeData] = useState<Array<any>>([]);
    const [secondDataSet, setSecondDataSet] = useState<any>(null);

    useEffect(() => {
        if (!connection) {
            return;
        }
        let unsubscribe : Function | null = null;

        aggreegatedSubscribe.listen(connection, 'ticks_history', {"ticks_history":"1HZ50V","style":"ticks","end":"latest","count":1000,"adjust_start_time":1,"subscribe":1,},
        (data: any) => {
            
            setSomeData((someData) => {
                const newData = [...someData];
                newData[0] = data;
                return newData;
            });
        }).then(({ unlisten: _uns }) => {
            unsubscribe = _uns;
        });

        return () => {
            console.log('>> unsubscribing #0');
            unsubscribe && unsubscribe();
        }

    }, [connection]);

    useEffect(() => {
        if (!connection) {
            return;
        }
        let unsubscribe : Function | null = null;

        aggreegatedSubscribe.listen(connection, 'ticks_history', {"ticks_history":"1HZ50V","style":"ticks","end":"latest","count":1000,"adjust_start_time":1,"subscribe":1,},
        (data: any) => {
            
            setSomeData((someData) => {
                const newData = [...someData];
                newData[1] = data;
                return newData;
            });
        }).then(({ unlisten: _uns }) => {
            unsubscribe = _uns;
        });

        return () => {
            console.log('>> unsubscribing #1');
            unsubscribe && unsubscribe();
        }

    }, [connection]);


    useEffect(() => {
        if (!connection) {
            return;
        }
        let unsubscribe : Function | null = null;

        aggreegatedSubscribe.listen(connection, 'ticks_history', {"ticks_history":"1HZ100V","style":"ticks","end":"latest","count":1000,"adjust_start_time":1,"subscribe":1,},
        (data: any) => {
            
            setSomeData((someData) => {
                const newData = [...someData];
                newData[2] = data;
                return newData;
            });
        }).then(({ unlisten: _uns }) => {
            unsubscribe = _uns;
        });

        return () => {
            console.log('>> unsubscribing #2');
            unsubscribe && unsubscribe();
        }

    }, [connection]);

    useEffect(() => {
        if (!connection) {
            return;
        }
        let unsubscribe : Function | null = null;

        aggreegatedSubscribe.listen(connection, 'ticks_history', {"ticks_history":"1HZ100V","style":"ticks","end":"latest","count":1000,"adjust_start_time":1,"subscribe":1,},
        (data: any) => {
            
            setSomeData((someData) => {
                const newData = [...someData];
                newData[3] = data;
                return newData;
            });
        }).then(({ unlisten: _uns }) => {
            unsubscribe = _uns;
        });

        return () => {
            console.log('>> unsubscribing #3');
            unsubscribe && unsubscribe();
        }

    }, [connection]);


    console.log('>> someData: ', someData);
    
    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                    len: {someData.length}
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
                    {someData && someData.map((data, idx) => {
                        return (
                            <>
                                <pre key={idx} style={{ border: '1px solid black', padding: '10px', width: '300px', height: '300px', overflow: 'auto' }}>
                                    {data && JSON.stringify(data, null, 2)}
                                </pre>
                            </>
                            
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default DepositFiat;
