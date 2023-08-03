import React from 'react';
import { translate } from '@i18n';
import { observer as globalObserver } from '@utilities/observer';
import AnimateTrade from './AnimateTrade';
import Summary from './Summary';
import TradeTable from './TradeTable';
import RunButton from './RunButton';
import ClearButton from './ClearButton';
import useIsMounted from '../../../common/hooks/isMounted';
import './summary-panel.scss';

const TradeInfoPanel = () => {
    const [account_id, setAccountId] = React.useState('');
    const [account_id_list, setAccountIdList] = React.useState([]);

    const isMounted = useIsMounted();

    React.useEffect(() => {
        globalObserver.register('bot.info', ({ accountID: account_id_param }) => {
            if (isMounted()) {
                if (!account_id_list.includes(account_id_param)) {
                    setAccountIdList(prevList => [...prevList, account_id_param]);
                }
                if (!account_id) {
                    setAccountId(account_id_param);
                }
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <span id='summary-panel' className='draggable-dialog' title={translate('Summary')}>
            <div>
                <div className='content'>
                    <div className='content-row'>
                        <div className='summary-toolbox'>
                            <RunButton />
                            <ClearButton />
                        </div>
                    </div>
                    <div className='content-row'>
                        <AnimateTrade />
                    </div>
                    <div className='content-row'>
                        <div>
                            <div className='content-row-table'>
                                <TradeTable account_id={account_id} />
                            </div>
                        </div>
                    </div>
                    <div className='content-row'>
                        <Summary accountID={account_id} />
                    </div>
                    <div>
                        <p id='sync-warning'>
                            {translate(
                                'Stopping the bot will prevent further trades. Any ongoing trades will be completed by our system. Please be aware that some completed transactions may not be displayed in the table if the bot is stopped while placing trades. You may refer to the Binary.com statement page for details of all completed transactions.'
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </span>
    );
};

export default TradeInfoPanel;
