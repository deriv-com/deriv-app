import React from 'react';
import { observer } from 'mobx-react-lite';
import { MobileFullPageModal } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { useStores } from 'Stores';
import { localize } from 'Components/i18next';
import CreateAdForm from './create-ad-form';
import PageReturn from 'Components/page-return/page-return.jsx';

const CreateAdFormRenderer = () => {
    const { my_ads_store } = useStores();

    if (isMobile()) {
        <MobileFullPageModal
            body_className='p2p-my-ads__modal-body'
            height_offset='80px'
            is_flex
            page_header_className='buy-sell__modal-header'
            page_header_text={localize('Create new ad')}
            pageHeaderReturnFn={() => my_ads_store.setShowAdForm(false)}
        >
            <CreateAdForm />
        </MobileFullPageModal>;
    }

    return (
        <React.Fragment>
            <PageReturn onClick={() => my_ads_store.setShowAdForm(false)} page_title={localize('Create new ad')} />
            <CreateAdForm />
        </React.Fragment>
    );
};

export default observer(CreateAdFormRenderer);
