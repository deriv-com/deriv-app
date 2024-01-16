import React, { useState } from 'react';
import { Heading } from '@deriv/quill-design';
import Actions from '../../components/SignupWizard/Actions';
import WizardScreenWrapper from '../../components/SignupWizard/WizardScreenWrapper';
import { CURRENCY_TYPES } from '../../constants/currencyConfig';
import Currencies from './Currencies';

const CurrencySelector = () => {
    const [currency, setCurrency] = useState('');

    // TODO: Remove this console.log
    // eslint-disable-next-line no-console
    console.log(currency);
    return (
        <WizardScreenWrapper>
            <div className='w-full p-1200 pt-2400'>
                <Heading.H5 className='mb-1200'>Select your preferred currency </Heading.H5>
                <Currencies type={CURRENCY_TYPES.FIAT} />
                <hr className='my-1200 opacity-100' />
                <Currencies type={CURRENCY_TYPES.CRYPTO} />
            </div>
            <Actions onSubmit={() => setCurrency('')} />
        </WizardScreenWrapper>
    );
};

export default CurrencySelector;
