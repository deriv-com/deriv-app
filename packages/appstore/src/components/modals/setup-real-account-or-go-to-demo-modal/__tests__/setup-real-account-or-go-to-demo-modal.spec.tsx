import React from 'react';
import SetupRealAccountOrGoToDemoModal from '../setup-real-account-or-go-to-demo-modal';
import { render } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useContentFlag: jest.fn(() => ({ is_cr_demo: true, is_eu_demo: false })),
    useGrowthbookGetFeatureValue: jest.fn(() => [false, true]),
}));

jest.mock('../setup-real-account-or-go-to-demo-modal-content', () => ({
    __esModule: true,
    default: () => undefined,
    SetupRealAccountOrGoToDemoModalContent: () => 'Content',
}));

describe('SetupRealAccountOrGoToDemoModal', () => {
    it('should render correctly', () => {
        const mock = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { container } = render(<SetupRealAccountOrGoToDemoModal />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
    });
});
