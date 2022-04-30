import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'Stores/connect';
import ProofOfOwnershipForm from './proof-of-ownership-form.jsx';
import POOSubmitted from 'Components/poo-submitted';

const ProofOfOwnership = ({ account_status }) => {
    const [cards] = account_status?.authentication?.ownership?.requests;
    const [status] = account_status?.authentication?.ownership?.status;

    const handleSubmit = e => {
        e.preventDefault();
        // TODO: submit logic
    };

    if (status === 'pending' && cards.length) {
        return <ProofOfOwnershipForm cards={cards} handleSubmit={handleSubmit} />;
    }
    // TODO: add screen for approved POO (status === 'none')
    if (status === 'none') {
        return null;
    }
    return <POOSubmitted />;
};

export default connect(({ client }) => ({
    account_status: client.account_status,
}))(withRouter(ProofOfOwnership));
