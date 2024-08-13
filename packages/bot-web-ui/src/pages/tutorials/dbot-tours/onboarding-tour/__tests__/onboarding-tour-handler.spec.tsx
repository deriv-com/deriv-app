import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import { mock_ws } from 'Utils/mock';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import OnboardingTourHandler from '../index';

jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());

jest.mock('../onboarding-tour-desktop', () => jest.fn(() => <div>OnboardingTourDesktop</div>));
jest.mock('../onboarding-tour-mobile', () => jest.fn(() => <div>OnboardingTourMobile</div>));

describe('OnboardingTourHandler', () => {
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

    it('should render OnboardingTourDesktop when is_mobile is false', () => {
        render(<OnboardingTourHandler is_mobile={false} />, {
            wrapper,
        });

        expect(screen.getByText('OnboardingTourDesktop')).toBeInTheDocument();
        expect(screen.queryByText('OnboardingTourMobile')).not.toBeInTheDocument();
    });

    it('should render OnboardingTourMobile when is_mobile is true', () => {
        render(<OnboardingTourHandler is_mobile={true} />);

        expect(screen.getByText('OnboardingTourMobile')).toBeInTheDocument();
        expect(screen.queryByText('OnboardingTourDesktop')).not.toBeInTheDocument();
    });
});
