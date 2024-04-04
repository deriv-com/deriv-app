import React from 'react';
import { render, screen } from '@testing-library/react';
import CreateEditAd from '../CreateEditAd';

jest.mock('react-hook-form', () => ({
    ...jest.requireActual('react-hook-form'),
    FormProvider: ({ children }) => <div>{children}</div>,
    useFormContext: () => ({
        formState: { errors: {}, isValid: true },
        getValues: () => ({
            'ad-type': 'buy',
            amount: '100',
            'payment-method': [],
            'rate-value': '1.2',
        }),
    }),
}));

jest.mock('@deriv/api-v2', () => ({
    p2p: {
        advert: {
            useCreate: () => ({
                error: undefined,
                isError: false,
                isSuccess: false,
                mutate: jest.fn(),
            }),
        },
        countryList: {
            useGet: () => ({
                data: {
                    af: {
                        country_name: 'Afghanistan',
                        cross_border_ads_enabled: 1,
                        fixed_rate_adverts: 'enabled',
                        float_rate_adverts: 'disabled',
                        float_rate_offset_limit: 10,
                        local_currency: 'AFN',
                        payment_methods: {
                            alipay: {
                                display_name: 'Alipay',
                                fields: {
                                    account: {
                                        display_name: 'Alipay ID',
                                        required: 1,
                                        type: 'text',
                                    },
                                    instructions: {
                                        display_name: 'Instructions',
                                        required: 0,
                                        type: 'memo',
                                    },
                                },
                                type: 'ewallet',
                            },
                        },
                    },
                },
            }),
        },
        settings: {
            useGetSettings: () => ({
                data: {
                    order_payment_period: 60,
                },
            }),
        },
    },
    useActiveAccount: () => ({ data: { currency: 'USD' } }),
}));

jest.mock('@/hooks', () => ({
    useFloatingRate: () => ({ rateType: 'floating' }),
}));

jest.mock('../../../components/AdWizard', () => ({
    AdWizard: () => <div>AdWizard</div>,
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: () => ({ isMobile: false }),
}));

describe('CreateEditAd', () => {
    it('should render the create edit ad component', () => {
        render(<CreateEditAd />);
        expect(screen.getByText('AdWizard')).toBeInTheDocument();
    });
});
