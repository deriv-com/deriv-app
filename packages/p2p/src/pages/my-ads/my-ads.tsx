import React from 'react';
import { Loading } from '@deriv/components';
import { observer } from '@deriv/stores';
import { localize } from 'Components/i18next';
import TableError from 'Components/section-error';
import Verification from 'Components/verification';
import { useStores } from 'Stores';
import CreateAd from './create-ad';
import EditAd from './edit-ad';
import MyAdsContent from './my-ads-content';

type TMyAdsStateProps = {
    message: string;
};

const MyAdsState = ({ message }: TMyAdsStateProps) => (
    <div className='my-ads__state'>
        <TableError message={message} className='section-error__table' size='xs' />
    </div>
);

const MyAds = () => {
    const { general_store, my_ads_store } = useStores();
    const { is_advertiser, is_restricted } = general_store;
    const {
        error_message,
        getAccountStatus,
        is_loading,
        setIsLoading,
        setShowAdForm,
        setShowEditAdForm,
        show_ad_form,
        show_edit_ad_form,
    } = my_ads_store;

    React.useEffect(() => {
        setIsLoading(true);
        setShowEditAdForm(false);
        getAccountStatus();

        return () => {
            setShowAdForm(false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (is_loading) {
        return <Loading is_fullscreen={false} />;
    }

    if (is_restricted) {
        return <MyAdsState message={localize('Deriv P2P cashier is unavailable in your country.')} />;
    }

    if (error_message) {
        return <MyAdsState message={error_message} />;
    }

    if (is_advertiser) {
        if (show_ad_form) {
            return (
                <div className='my-ads'>
                    <CreateAd />
                </div>
            );
        } else if (show_edit_ad_form) {
            return (
                <div className='my-ads'>
                    <EditAd />
                </div>
            );
        }

        return (
            <div className='my-ads'>
                <MyAdsContent />
            </div>
        );
    }

    return <Verification />;
};

export default observer(MyAds);
