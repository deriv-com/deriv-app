import * as React from 'react';
import { Loading } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { localize } from 'Components/i18next';
import PageReturn from 'Components/page-return/page-return.jsx';
import { useStore } from '@deriv/stores';
import CreateAdForm from './create-ad-form.jsx';

const CreateAd = () => {
    const {
        modules: { p2p_store },
    } = useStore();
    const { my_ads_store } = p2p_store;

    return (
        <React.Fragment>
            <PageReturn onClick={() => my_ads_store.setShowAdForm(false)} page_title={localize('Create new ad')} />
            {my_ads_store.is_form_loading ? <Loading is_fullscreen={false} /> : <CreateAdForm />}
        </React.Fragment>
    );
};

export default observer(CreateAd);
