import React from 'react';
import { observer } from '@deriv/stores';
import { localize } from 'Components/i18next';
import PageReturn from 'Components/page-return';
import { useStores } from 'Stores/index';
import CreateAdForm from './create-ad-form';

const CreateAd = () => {
    const { my_ads_store } = useStores();
    const { setApiErrorMessage, setShowAdForm } = my_ads_store;

    const onClickBack = () => {
        setApiErrorMessage('');
        setShowAdForm(false);
    };
    return (
        <React.Fragment>
            <PageReturn onClick={onClickBack} page_title={localize('Create new ad')} />
            <CreateAdForm />
        </React.Fragment>
    );
};

export default observer(CreateAd);
