import React from 'react';
import { Loading } from '@deriv/components';
import { useIsMounted } from '@deriv/shared';
import { localize } from 'Components/i18next';
import Dp2pContext from 'Components/context/dp2p-context';
import { TableError } from 'Components/table/table-error.jsx';
import { requestWS } from 'Utils/websocket';
import FormAds from './form-ads.jsx';
import MyAdsTable from './my-ads-table.jsx';
import Verification from '../verification/verification.jsx';
import './my-ads.scss';

const MyAdsState = ({ message }) => (
    <div className='p2p-my-ads__state'>
        <TableError message={message} />
    </div>
);

const MyAds = () => {
    const { is_advertiser, is_restricted, setPoiStatus } = React.useContext(Dp2pContext);
    const [error_message, setErrorMessage] = React.useState('');
    const [is_loading, setIsLoading] = React.useState(true);
    const [show_ad_form, setShowAdForm] = React.useState(false);
    const isMounted = useIsMounted();

    React.useEffect(() => {
        if (isMounted()) {
            if (!is_advertiser) {
                requestWS({ get_account_status: 1 }).then(response => {
                    if (isMounted()) {
                        if (!response.error) {
                            const { get_account_status } = response;
                            const { status } = get_account_status.authentication.identity;
                            setPoiStatus(status);
                        } else {
                            setErrorMessage(response.error);
                        }
                        setIsLoading(false);
                    }
                });
            } else {
                setIsLoading(false);
            }
        }
    }, []);

    const handleShowForm = show_form => {
        setShowAdForm(show_form);
    };

    const onClickCreate = () => {
        setShowAdForm(true);
    };

    if (is_loading) {
        return <Loading is_fullscreen={false} />;
    }

    if (is_restricted) {
        return <MyAdsState message={localize('DP2P cashier is unavailable in your country.')} />;
    }

    if (error_message) {
        return <MyAdsState message={error_message} />;
    }

    if (is_advertiser) {
        return (
            <div className='p2p-my-ads'>
                {show_ad_form ? (
                    <FormAds handleShowForm={handleShowForm} />
                ) : (
                    <MyAdsTable onClickCreate={onClickCreate} />
                )}
            </div>
        );
    }

    return <Verification />;
};

export default MyAds;
