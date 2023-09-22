import React from 'react';
import { screen, render } from '@testing-library/react';
import SVGMigrationBanner from '../svg-migration-banner';
import { StoreProvider, mockStore } from '@deriv/stores';

const mock_store = mockStore({});

describe('SVGMigrationBanner', () => {
    const renderComponent = () => {
        render(
            <StoreProvider store={mock_store}>
                <SVGMigrationBanner />
            </StoreProvider>
        );
    };

    it('should render SVGMigrationBanner', () => {
        renderComponent();
        const texts = [/We’re upgrading your/i, /MT5 Derived SVG/i, /MT5 Financial SVG/i, /and/i, /account./i];
        texts.forEach(text => {
            expect(screen.getByText(text)).toBeInTheDocument();
        });
        expect(screen.getByRole('button', { name: /upgrade now/i })).toBeInTheDocument();
        expect(screen.getByTestId('dt_svg_migrate_desktop')).toBeInTheDocument();
    });

    it('should render SVGMigrationBanner with migration mobile image', () => {
        mock_store.ui.is_mobile = true;
        renderComponent();
        expect(screen.getByTestId('dt_svg_migrate_mobile')).toBeInTheDocument();
    });
});
