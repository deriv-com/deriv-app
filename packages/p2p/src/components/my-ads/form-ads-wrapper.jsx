import React from 'react';
import PropTypes from 'prop-types';
import { MobileFullPageModal } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { observer } from 'mobx-react-lite';
import { localize } from 'Components/i18next';
import { useStores } from 'Stores';

const FormAdsWrapper = ({ children }) => {
    const { my_ads_store } = useStores();

    return isMobile() ? (
        <MobileFullPageModal
            className='p2p-my-ads__form'
            is_modal_open={my_ads_store.show_ad_form}
            page_header_text={localize('Create new ad')}
            pageHeaderReturnFn={() => my_ads_store.setShowAdForm(false)}
            is_flex
        >
            {children}
        </MobileFullPageModal>
    ) : (
        <React.Fragment>{children}</React.Fragment>
    );
};

FormAdsWrapper.propTypes = {
    children: PropTypes.any,
    is_modal_open: PropTypes.bool,
};

export default observer(FormAdsWrapper);
