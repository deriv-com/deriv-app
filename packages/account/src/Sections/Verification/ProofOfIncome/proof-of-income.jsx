import React from 'react';
import { PropTypes } from 'prop-types';
import { PlatformContext } from '@deriv/shared';
import { connect } from 'Stores/connect';
import DemoMessage from 'Components/demo-message';
import ProofOfIncomeContainer from './proof-of-income-container.jsx';

const ProofOfIncome = ({ is_virtual, is_switching, refreshNotifications }) => {
    const { is_appstore } = React.useContext(PlatformContext);
    if (is_virtual) return <DemoMessage has_demo_icon={is_appstore} has_button={true} />;

    return <ProofOfIncomeContainer is_switching={is_switching} refreshNotifications={refreshNotifications} />;
};

ProofOfIncome.propTypes = {
    is_switching: PropTypes.bool,
    is_virtual: PropTypes.bool,
    refreshNotifications: PropTypes.func,
};

export default connect(({ client, notifications }) => ({
    is_switching: client.is_switching,
    is_virtual: client.is_virtual,
    refreshNotifications: notifications.refreshNotifications,
}))(ProofOfIncome);
