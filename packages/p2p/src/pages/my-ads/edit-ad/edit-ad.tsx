import React from 'react';
import { Loading } from '@deriv/components';
import { observer } from '@deriv/stores';
import { useStores } from 'Stores';
import EditAdForm from './edit-ad-form';

const EditAd = () => {
    const { my_ads_store } = useStores();
    const { getAdvertInfo, is_form_loading } = my_ads_store;

    React.useEffect(() => getAdvertInfo(), [getAdvertInfo]);

    return <React.Fragment>{is_form_loading ? <Loading is_fullscreen={false} /> : <EditAdForm />}</React.Fragment>;
};

export default observer(EditAd);
