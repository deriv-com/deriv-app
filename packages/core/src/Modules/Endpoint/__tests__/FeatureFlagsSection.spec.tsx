import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StoreProvider, mockStore } from '@deriv/stores';
import { FeatureFlagsSection } from '../FeatureFlagsSection';
import { website_domain } from '@deriv/shared';

const FLAGS = {
    WALLET: 'wallet',
    NEXT_WALLET: 'next_wallet',
    SHARKFIN: 'sharkfin',
    DTRADER_V2: 'dtrader_v2',
};
const feature_flags_title = 'Feature flags';

describe('<FeatureFlagsSection/>', () => {
    const original_window_location = window.location;
    let default_mock_store: ReturnType<typeof mockStore>;

    beforeEach(() => {
        Object.defineProperty(window, 'location', {
            configurable: true,
            enumerable: true,
            value: new URL('https://localhost:8443'),
        });

        default_mock_store = mockStore({
            feature_flags: {
                data: {
                    wallet: false,
                    next_wallet: false,
                    sharkfin: false,
                    dtrader_v2: false,
                },
            },
        });
    });

    afterEach(() => {
        Object.defineProperty(window, 'location', {
            configurable: true,
            enumerable: true,
            value: original_window_location,
        });
    });

    const mockFeatureFlagsSection = (store: ReturnType<typeof mockStore> = default_mock_store) => {
        return (
            <StoreProvider store={store}>
                <FeatureFlagsSection />
            </StoreProvider>
        );
    };

    it('should render all flags except for the wallet flag on localhost', () => {
        render(mockFeatureFlagsSection());

        expect(screen.getByText(feature_flags_title)).toBeInTheDocument();
        expect(screen.getByRole('checkbox', { name: FLAGS.NEXT_WALLET })).not.toBeChecked();
        expect(screen.getByRole('checkbox', { name: FLAGS.SHARKFIN })).not.toBeChecked();
        expect(screen.getByRole('checkbox', { name: FLAGS.DTRADER_V2 })).not.toBeChecked();
        expect(screen.queryByRole('checkbox', { name: FLAGS.WALLET })).not.toBeInTheDocument();
    });
    it('should render checked next_wallet, sharkfin & dtrader_v2 flags on localhost', () => {
        render(
            mockFeatureFlagsSection(
                mockStore({
                    feature_flags: {
                        data: {
                            wallet: false,
                            next_wallet: true,
                            sharkfin: true,
                            dtrader_v2: true,
                        },
                    },
                })
            )
        );

        expect(screen.getByRole('checkbox', { name: FLAGS.NEXT_WALLET })).toBeChecked();
        expect(screen.getByRole('checkbox', { name: FLAGS.SHARKFIN })).toBeChecked();
        expect(screen.getByRole('checkbox', { name: FLAGS.DTRADER_V2 })).toBeChecked();
        expect(screen.queryByRole('checkbox', { name: FLAGS.WALLET })).not.toBeInTheDocument();
    });
    it('should render all flags except for the wallet flag on binary.sx domain', () => {
        location.hostname = 'test.binary.sx';
        render(mockFeatureFlagsSection());

        expect(screen.getByRole('checkbox', { name: FLAGS.NEXT_WALLET })).toBeInTheDocument();
        expect(screen.getByRole('checkbox', { name: FLAGS.SHARKFIN })).toBeInTheDocument();
        expect(screen.getByRole('checkbox', { name: FLAGS.DTRADER_V2 })).toBeInTheDocument();
        expect(screen.queryByRole('checkbox', { name: FLAGS.WALLET })).not.toBeInTheDocument();
    });
    it('should render all flags except for the wallet flag on staging', () => {
        location.hostname = 'staging-app.deriv.com';
        render(mockFeatureFlagsSection());

        expect(screen.getByRole('checkbox', { name: FLAGS.NEXT_WALLET })).toBeInTheDocument();
        expect(screen.getByRole('checkbox', { name: FLAGS.SHARKFIN })).toBeInTheDocument();
        expect(screen.getByRole('checkbox', { name: FLAGS.DTRADER_V2 })).toBeInTheDocument();
        expect(screen.queryByRole('checkbox', { name: FLAGS.WALLET })).not.toBeInTheDocument();
    });
    it('should render a single next_wallet flag on production', () => {
        location.hostname = website_domain;
        render(mockFeatureFlagsSection());

        expect(screen.getByRole('checkbox', { name: FLAGS.NEXT_WALLET })).toBeInTheDocument();
        expect(screen.queryByRole('checkbox', { name: FLAGS.SHARKFIN })).not.toBeInTheDocument();
        expect(screen.queryByRole('checkbox', { name: FLAGS.DTRADER_V2 })).not.toBeInTheDocument();
        expect(screen.queryByRole('checkbox', { name: FLAGS.WALLET })).not.toBeInTheDocument();
    });
    it('should not render any flags or "Feature flags" title when data object with flags is undefined', () => {
        delete default_mock_store.feature_flags.data;
        render(mockFeatureFlagsSection());

        expect(screen.queryByRole(feature_flags_title)).not.toBeInTheDocument();
        expect(screen.queryByRole('checkbox', { name: FLAGS.NEXT_WALLET })).not.toBeInTheDocument();
        expect(screen.queryByRole('checkbox', { name: FLAGS.SHARKFIN })).not.toBeInTheDocument();
        expect(screen.queryByRole('checkbox', { name: FLAGS.DTRADER_V2 })).not.toBeInTheDocument();
        expect(screen.queryByRole('checkbox', { name: FLAGS.WALLET })).not.toBeInTheDocument();
    });
    it('should call feature_flags.update() method when a flag is checked', () => {
        const update = jest.fn();
        default_mock_store.feature_flags.update = update;
        render(mockFeatureFlagsSection());

        userEvent.click(screen.getByRole('checkbox', { name: FLAGS.NEXT_WALLET }));

        expect(update).toBeCalled();
    });
});
