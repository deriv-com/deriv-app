import React from 'react';
import { localize } from 'Components/i18next';
import Dp2pContext from 'Components/context/dp2p-context';
import { TableError } from 'Components/table/table-error.jsx';
import { requestWS } from 'Utils/websocket';
import FormAds from './form-ads.jsx';
import MyAdsTable from './my-ads-table.jsx';
import Verification from '../verification/verification.jsx';
import { useStores } from '../../../stores';
import './my-ads.scss';

const MyAdsState = ({ message }) => (
    <div className='p2p-my-ads__state'>
        <TableError message={message} />
    </div>
);

const MyAds = () => {
    const { general_store } = useStores();
    const is_loading = React.useRef(true);
    const is_mounted = React.useRef(false);
    const [show_form, setShowForm] = React.useState(false);
    const [poi_status, setPoiStatus] = React.useState(null);

    React.useEffect(() => {
        is_mounted.current = true;

        if (!general_store.is_advertiser) {
            requestWS({ get_account_status: 1 }).then(response => {
                if (is_mounted.current && !response.error) {
                    const { get_account_status } = response;
                    const { authentication } = get_account_status;
                    const { identity } = authentication;
                    const { status } = identity;

                    setPoiStatus(status);
                }
                is_loading.current = false;
            });
        } else {
            is_loading.current = false;
        }
    }, []);

    const handleShowForm = show_form => {
        setShowForm(show_form);
    };

    const onClickCreate = () => {
        setShowForm(true);
    };

    // render() {
    if (general_store.is_restricted) {
        return <MyAdsState message={localize('P2P cashier is unavailable in your country.')} />;
    }

    if (general_store.is_advertiser) {
        return (
            <div className='p2p-my-ads'>
                {show_form ? <FormAds handleShowForm={handleShowForm} /> : <MyAdsTable onClickCreate={onClickCreate} />}
            </div>
        );
    }

    return <Verification />;
};

// }

export default MyAds;

MyAds.contextType = Dp2pContext;
