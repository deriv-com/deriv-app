import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StoreProvider, mockStore } from '@deriv/stores';
import { FeatureFlagsSection } from '../FeatureFlagsSection';
import { website_domain } from '@deriv/shared';

const FLAGS = {
    WALLET: 'wallet',
    SHARKFIN: 'sharkfin',
    DTRADER_V2: 'dtrader_v2',
};
const feature_flags_title = 'Feature flags';

describe('<FeatureFlagsSection/>', () => {
    const original_window_location = { ...window.location };
    const original_location = { ...location };
    let default_mock_store: ReturnType<typeof mockStore>;

    beforeEach(() => {
        Object.defineProperty(window, 'location', {
            value: { ...original_window_location },
            configurable: true,
            writable: true,
        });

        Object.defineProperty(global, 'location', {
            value: { ...original_location },
            configurable: true,
            writable: true,
        });

        window.location.href = 'https://localhost:8443';

        default_mock_store = mockStore({
            feature_flags: {
                data: {
                    wallet: false,
                    sharkfin: false,
                    dtrader_v2: false,
                },
            },
        });
    });

    afterEach(() => {
        jest.clearAllMocks();

        Object.defineProperty(window, 'location', {
            value: { ...original_window_location },
            configurable: true,
            writable: true,
        });

        Object.defineProperty(global, 'location', {
            value: { ...original_location },
            configurable: true,
            writable: true,
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
        expect(screen.getByRole('checkbox', { name: FLAGS.SHARKFIN })).not.toBeChecked();
        expect(screen.getByRole('checkbox', { name: FLAGS.DTRADER_V2 })).not.toBeChecked();
        expect(screen.queryByRole('checkbox', { name: FLAGS.WALLET })).not.toBeInTheDocument();
    });
    it('should render checked sharkfin & dtrader_v2 flags on localhost', () => {
        render(
            mockFeatureFlagsSection(
                mockStore({
                    feature_flags: {
                        data: {
                            wallet: false,
                            sharkfin: true,
                            dtrader_v2: true,
                        },
                    },
                })
            )
        );

        expect(screen.getByRole('checkbox', { name: FLAGS.SHARKFIN })).toBeChecked();
        expect(screen.getByRole('checkbox', { name: FLAGS.DTRADER_V2 })).toBeChecked();
        expect(screen.queryByRole('checkbox', { name: FLAGS.WALLET })).not.toBeInTheDocument();
    });
    it('should render all flags except for the wallet flag on binary.sx domain', () => {
        location.hostname = 'test.binary.sx';
        render(mockFeatureFlagsSection());

        expect(screen.getByRole('checkbox', { name: FLAGS.SHARKFIN })).toBeInTheDocument();
        expect(screen.getByRole('checkbox', { name: FLAGS.DTRADER_V2 })).toBeInTheDocument();
        expect(screen.queryByRole('checkbox', { name: FLAGS.WALLET })).not.toBeInTheDocument();
    });
    it('should render all flags except for the wallet flag on staging', () => {
        location.hostname = 'staging-app.deriv.com';
        render(mockFeatureFlagsSection());

        expect(screen.getByRole('checkbox', { name: FLAGS.SHARKFIN })).toBeInTheDocument();
        expect(screen.getByRole('checkbox', { name: FLAGS.DTRADER_V2 })).toBeInTheDocument();
        expect(screen.queryByRole('checkbox', { name: FLAGS.WALLET })).not.toBeInTheDocument();
    });
    it('should render none of the flags on production', () => {
        location.hostname = website_domain;
        render(mockFeatureFlagsSection());

        expect(screen.queryByRole('checkbox', { name: FLAGS.SHARKFIN })).not.toBeInTheDocument();
        expect(screen.queryByRole('checkbox', { name: FLAGS.DTRADER_V2 })).not.toBeInTheDocument();
        expect(screen.queryByRole('checkbox', { name: FLAGS.WALLET })).not.toBeInTheDocument();
    });
    it('should not render any flags or "Feature flags" title when data object with flags is undefined', () => {
        delete default_mock_store.feature_flags.data;
        render(mockFeatureFlagsSection());

        expect(screen.queryByRole(feature_flags_title)).not.toBeInTheDocument();
        expect(screen.queryByRole('checkbox', { name: FLAGS.SHARKFIN })).not.toBeInTheDocument();
        expect(screen.queryByRole('checkbox', { name: FLAGS.DTRADER_V2 })).not.toBeInTheDocument();
        expect(screen.queryByRole('checkbox', { name: FLAGS.WALLET })).not.toBeInTheDocument();
    });
    it('should call feature_flags.update() method when a flag is checked', () => {
        const update = jest.fn();
        default_mock_store.feature_flags.update = update;
        render(mockFeatureFlagsSection());

        userEvent.click(screen.getByRole('checkbox', { name: FLAGS.DTRADER_V2 }));

        expect(update).toBeCalled();
    });
});
