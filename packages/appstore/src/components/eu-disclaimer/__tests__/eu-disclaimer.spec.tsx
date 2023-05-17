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

        const eu_statutory_disclaimer = screen.queryByText('EU statutory disclaimer');

        expect(eu_statutory_disclaimer).toBeInTheDocument();
    });

    it('Check disclaimer for wallets exists', () => {
        render(
            <StoreProvider store={mockedRootStore}>
                <EUDisclaimer is_wallet={true} />
            </StoreProvider>
        );

        const eu_statutory_disclaimer = screen.queryByText('EU statutory disclaimer');

        expect(eu_statutory_disclaimer).not.toBeInTheDocument();
    });

    it('Check classes when don\t pass the props', () => {
        const { container } = render(
            <StoreProvider store={mockedRootStore}>
                <EUDisclaimer />
            </StoreProvider>
        );

        const text = screen.queryByTestId('dt_disclaimer_text');

        expect(container.childNodes[0]).toHaveClass('disclaimer');
        expect(text).toHaveClass('disclaimer-text');
    });

    it('Check classes when pass the props', () => {
        const { container } = render(
            <StoreProvider store={mockedRootStore}>
                <EUDisclaimer wrapperClassName='wrapper-class' textClassName='text-class' />
            </StoreProvider>
        );

        const text = screen.queryByTestId('dt_disclaimer_text');

        expect(container.childNodes[0]).not.toHaveClass('disclaimer');
        expect(text).not.toHaveClass('disclaimer-text');
        expect(container.childNodes[0]).toHaveClass('wrapper-class');
        expect(text).toHaveClass('text-class');
    });
});
