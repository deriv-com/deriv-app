import React from 'react';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { TStores } from '@deriv/stores/types';
import { CFDStoreProvider } from 'Stores/Modules/CFD/Helpers/useCfdStores';
import { TTradingPlatformAvailableAccount } from 'Components/props.types';
import { TJurisdictionModalProps } from '../../props.types';
import JurisdictionModal from '../jurisdiction-modal';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isMobile: false, isDesktop: true })),
}));

jest.mock('@deriv/shared/src/utils/screen/responsive', () => ({
    ...jest.requireActual('@deriv/shared/src/utils/screen/responsive'),
    isMobile: jest.fn(),
    isDesktop: jest.fn(() => true),
}));

jest.mock('../../dynamic-leverage/dynamic-leverage-modal-content', () =>
    jest.fn(() => <div data-testid='dynamic_leverage_modal_content' />)
);

let modal_root_el: HTMLDivElement, store: TStores;

const mock_store = {
    common: {},
    client: {
        trading_platform_available_accounts: [
            {
                market_type: 'financial',
                name: 'Deriv (SVG) LLC',
                shortcode: 'svg',
                sub_account_type: 'swap_free',
            } as TTradingPlatformAvailableAccount,
        ],
    },
    ui: {
        disableApp: jest.fn(),
        enableApp: jest.fn(),
    },
    traders_hub: {
        show_eu_related_content: false,
    },
    modules: {
        cfd: {
            account_type: {
                type: 'Financial',
            },
            is_jurisdiction_modal_visible: true,
            toggleJurisdictionModal: jest.fn(),
            setJurisdictionSelectedShortcode: jest.fn(),
        },
    },
};

beforeEach(() => {
    store = mockStore(mock_store);
});

beforeAll(() => {
    modal_root_el = document.createElement('div');
    modal_root_el.setAttribute('id', 'modal_root');
    document.body.appendChild(modal_root_el);
});

afterAll(() => {
    document.body.removeChild(modal_root_el);
});

const JurisdictionModalComponent = (props: TJurisdictionModalProps) => {
    return (
        <StoreProvider store={store}>
            <CFDStoreProvider>
                <JurisdictionModal {...props} />
            </CFDStoreProvider>
        </StoreProvider>
    );
};

describe('JurisdictionModal', () => {
    const mock_props = {
        openPasswordModal: jest.fn(),
    };

    it('should render JurisdictionModal', () => {
        store = mockStore({
            ...mock_store,
            common: { platform: 'mt5' },
        });
        render(<JurisdictionModalComponent {...mock_props} />);

        const title = screen.getByRole('heading');
        const close_button = screen.getAllByRole('button')[0];

        expect(title).toBeInTheDocument();
        expect(title).toHaveTextContent('Choose a jurisdiction for your Deriv MT5 Financial account');
        expect(close_button).toBeInTheDocument();
    });

    it('should render JurisdictionModal with show_eu_related_content', () => {
        store = mockStore({
            ...mock_store,
            traders_hub: { show_eu_related_content: true },
            common: { platform: 'mt5' },
        });

        render(<JurisdictionModalComponent {...mock_props} />);

        const title = screen.getByRole('heading');

        expect(title).toBeInTheDocument();
        expect(title).toHaveTextContent('Choose a jurisdiction for your Deriv MT5 CFDs account');
    });
});
