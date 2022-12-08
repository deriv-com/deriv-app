import React from 'react';
import { Loading } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { useStore } from '@deriv/stores';
import EditAdForm from './edit-ad-form.jsx';

const EditAd = () => {
    const {
        modules: { p2p_store },
    } = useStore();
    const { my_ads_store } = p2p_store;

    // eslint-disable-next-line react-hooks/exhaustive-deps
    React.useEffect(() => my_ads_store.getAdvertInfo(), []);

    return (
        <React.Fragment>
            {my_ads_store.is_form_loading ? <Loading is_fullscreen={false} /> : <EditAdForm />}
        </React.Fragment>
    );
};

export default observer(EditAd);
