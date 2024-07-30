import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import { mock_ws } from 'Utils/mock';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import OnboardingTourMobile from '../onboarding-tour/onboarding-tour-mobile';
import { DBOT_ONBOARDING_MOBILE } from '../tour-content';

jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());

describe('Tour Content', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element;
    const mock_store = mockStore({});
    const mock_DBot_store = mockDBotStore(mock_store, mock_ws);

    beforeEach(() => {
        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
    });
    it('DBOT_ONBOARDING_MOBILE is called', () => {
        render(<OnboardingTourMobile />, {
            wrapper,
        });
        const first_step = DBOT_ONBOARDING_MOBILE[0];
        expect(screen.getByText(first_step.header)).toBeInTheDocument();
    });
});
