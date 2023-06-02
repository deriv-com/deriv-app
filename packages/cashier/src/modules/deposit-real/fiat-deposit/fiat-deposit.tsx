import React from 'react';
import { useFetch } from '@deriv/api';
import { Loading } from '@deriv/components';
import { PageContainer } from '../../../components/page-container';
import SideNote from '../../../components/side-note';
import CashierOnboardingSideNotePaymentMethods from '../../cashier-onboarding/components/cashier-onboarding-side-notes/cashier-onboarding-side-note-payment-methods';
import './fiat-deposit.scss';

const FiatDeposit = () => {
    const [show_loader, setShowLoader] = React.useState(true);
    const { data, isSuccess } = useFetch('cashier', {
        payload: {
            cashier: 'deposit',
            provider: 'doughflow',
            verification_code: 'my_verification_code',
        },
    });

    return (
        <PageContainer
            hide_breadcrumb={show_loader}
            right={!show_loader && <CashierOnboardingSideNotePaymentMethods />}
        >
            {show_loader && <Loading className='fiat-deposit__loader' />}
            {isSuccess && (
                <iframe
                    className='fiat-deposit__iframe'
                    src={data.cashier}
                    style={!show_loader ? { display: 'block' } : { display: 'none' }}
                    onLoad={() => setShowLoader(false)}
                />
            )}
        </PageContainer>
    );
};

export default FiatDeposit;
