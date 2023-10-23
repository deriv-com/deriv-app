import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { mockStore, StoreProvider } from '@deriv/stores';
import EUDisclaimer from '../eu-disclaimer';

const mockedRootStore = mockStore({});

describe('<EUDisclaimer />', () => {
    it('Check disclaimer exists', () => {
        render(
            <StoreProvider store={mockedRootStore}>
                <EUDisclaimer />
            </StoreProvider>
        );

        const eu_statutory_disclaimer = screen.getByText('EU statutory disclaimer');

        expect(eu_statutory_disclaimer).toBeInTheDocument();
    });

    it('Check disclaimer for wallets exists', () => {
        render(
            <StoreProvider store={mockedRootStore}>
                <EUDisclaimer is_wallet />
            </StoreProvider>
        );

        const eu_statutory_disclaimer = screen.queryByText('EU statutory disclaimer');

        expect(eu_statutory_disclaimer).not.toBeInTheDocument();
    });

    it('Check classes when dont pass the props', () => {
        render(
            <StoreProvider store={mockedRootStore}>
                <EUDisclaimer />
            </StoreProvider>
        );

        const wrapper = screen.getByTestId('dt_disclaimer_wrapper');
        const text = screen.getByTestId('dt_disclaimer_text');

        expect(wrapper).toHaveClass('disclaimer');
        expect(text).toHaveClass('disclaimer-text');
    });

    it('Check classes when pass the props', () => {
        render(
            <StoreProvider store={mockedRootStore}>
                <EUDisclaimer wrapperClassName='wrapper-class' textClassName='text-class' />
            </StoreProvider>
        );

        const wrapper = screen.getByTestId('dt_disclaimer_wrapper');
        const text = screen.getByTestId('dt_disclaimer_text');

        expect(wrapper).not.toHaveClass('disclaimer');
        expect(text).not.toHaveClass('disclaimer-text');
        expect(wrapper).toHaveClass('wrapper-class');
        expect(text).toHaveClass('text-class');
    });
});
