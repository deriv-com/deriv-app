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
            useGet: () => ({
                data: {},
                isLoading: false,
            }),
            useUpdate: () => ({
                error: undefined,
                isError: false,
                isSuccess: false,
                mutate: jest.fn(),
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
    ...jest.requireActual('@/hooks'),
    useFloatingRate: () => ({ rateType: 'floating' }),
    useQueryString: jest.fn().mockReturnValue({ queryString: { advertId: '' } }),
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
