import React from 'react';
import { connect, MobxContentProvider } from 'Stores/connect';
import PopulateHeader from './populate-header';
import { MobileWrapper } from '@deriv/components';
import PropTypes from 'prop-types';

const TradeHeaderExtensions = ({ populateHeaderExtensions, store }) => {
    React.useEffect(() => {
        const header_items = (
            <MobileWrapper>
                <MobxContentProvider store={store}>
                    <PopulateHeader />
                </MobxContentProvider>
            </MobileWrapper>
        );

        populateHeaderExtensions(header_items);
    });

    return null;
};

TradeHeaderExtensions.propTypes = {
    populateHeaderExtensions: PropTypes.func,
    store: PropTypes.object,
};

export default connect(({ ui }) => ({
    populateHeaderExtensions: ui.populateHeaderExtensions,
}))(TradeHeaderExtensions);
