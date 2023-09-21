import React from 'react';
import { observer, useStore } from '@deriv/stores';
import DemoMessage from '../../../Components/demo-message';
import ProofOfAddressContainer from './proof-of-address-container';

const ProofOfAddress = observer(() => {
    const { client } = useStore();
    const { is_virtual } = client;

    if (is_virtual) return <DemoMessage has_button />;

    return <ProofOfAddressContainer />;
});

export default ProofOfAddress;
