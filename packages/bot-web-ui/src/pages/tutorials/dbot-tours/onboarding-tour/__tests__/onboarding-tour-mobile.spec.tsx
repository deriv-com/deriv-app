import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mock_ws } from 'Utils/mock';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import OnboardingTourMobile from '../onboarding-tour-mobile';

jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());

describe('Onboarding Tour Mobile', () => {
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
    it('should render OnboardingTourMobile component', () => {
        render(<OnboardingTourMobile />, {
            wrapper,
        });
        expect(screen.getByText('Get started on Deriv Bot')).toBeInTheDocument();
    });

    it('should render OnboardingTourMobile steps when clicking start', () => {
        render(<OnboardingTourMobile />, {
            wrapper,
        });

        const start_button = screen.getByRole('button', { name: 'Start' });
        userEvent.click(start_button);
        expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
    });

    it('should render OnboardingTourMobile steps with previous button from second step', () => {
        render(<OnboardingTourMobile />, {
            wrapper,
        });

        const start_button = screen.getByRole('button', { name: 'Start' });
        userEvent.click(start_button);

        const next_button = screen.getByRole('button', { name: 'Next' });
        userEvent.click(next_button);
        expect(screen.getByRole('button', { name: 'Previous' })).toBeInTheDocument();

        const previous_button = screen.getByRole('button', { name: 'Previous' });
        userEvent.click(previous_button);
        expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
    });

    it('should close OnboardingTourMobile when clicking on skip', () => {
        render(<OnboardingTourMobile />, {
            wrapper,
        });

        const skip_button = screen.getByRole('button', { name: 'Skip' });
        userEvent.click(skip_button);
        expect(mock_DBot_store.dashboard.active_tour).toBe('');
    });
});
