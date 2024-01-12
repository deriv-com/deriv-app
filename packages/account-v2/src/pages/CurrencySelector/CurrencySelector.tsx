import React, { useState } from 'react';
import Actions from '../../components/SignupWizard/Actions';
import WizardScreenWrapper from '../../components/SignupWizard/WizardScreenWrapper';
import Currencies from './Currencies';
import { CURRENCY_TYPES } from './helpers';

const CurrencySelector = () => {
    const [currency, setCurrency] = useState('');

    // TODO: Remove this console.log
    // eslint-disable-next-line no-console
    console.log(currency);
    return (
        <WizardScreenWrapper>
            <div className='w-full pt-2400'>
                <Currencies type={CURRENCY_TYPES.CRYPTO} />
                <Currencies type={CURRENCY_TYPES.FIAT} />
            </div>
            <Actions onSubmit={() => setCurrency('')} />
        </WizardScreenWrapper>
    );
};

export default CurrencySelector;
