import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { TStores } from '@deriv/stores/types';
import { CFDStoreProvider } from 'Stores/Modules/CFD/Helpers/useCfdStores';
import { TJurisdictionModalProps } from 'Containers/props.types';
import JurisdictionModal from '../jurisdiction-modal';

jest.mock('@deriv/shared/src/utils/screen/responsive', () => ({
    ...jest.requireActual('@deriv/shared/src/utils/screen/responsive'),
    isMobile: jest.fn(),
    isDesktop: jest.fn(() => true),
}));

jest.mock('../jurisdiction-modal-content-wrapper', () =>
    jest.fn(({ toggleDynamicLeverage }) => (
        <div data-testid='jurisdiction_modal_content_wrapper'>
            <button data-testid='toggleDynamicLeverage' onClick={toggleDynamicLeverage} />
        </div>
    ))
);
jest.mock('../../dynamic-leverage/dynamic-leverage-modal-content', () =>
    jest.fn(() => <div data-testid='dynamic_leverage_modal_content' />)
);

let modal_root_el: HTMLDivElement, store: TStores;

const mock_store = {
    common: {},
    client: {},
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
        render(<JurisdictionModalComponent {...mock_props} />);

        const title = screen.getByRole('heading');
        const closeButton = screen.getAllByRole('button')[0];

        expect(title).toBeInTheDocument();
        expect(title).toHaveTextContent('Choose a jurisdiction for your Deriv MT5 Financial account');
        expect(closeButton).toBeInTheDocument();
    });

    it('should render JurisdictionModal with dynamic leverage modal', async () => {
        render(<JurisdictionModalComponent {...mock_props} />);
        const toggleButton = screen.getByTestId('toggleDynamicLeverage');
        fireEvent.click(toggleButton);

        const title = screen.getByRole('heading');
        const backButton = screen.getByTestId('back_icon');
        const modal_content = screen.getByTestId('modal_content');

        expect(modal_content).toBeInTheDocument();
        expect(modal_content).toHaveClass('jurisdiction-modal__flipped');
        expect(title).toBeInTheDocument();
        expect(title).toHaveTextContent('Get more out of Deriv MT5 Financial');
        expect(backButton).toBeInTheDocument();

        fireEvent.click(backButton);
        expect(modal_content).not.toHaveClass('jurisdiction-modal__flipped');
    });

    it('should render JurisdictionModal with show_eu_related_content', () => {
        store = mockStore({ ...mock_store, traders_hub: { show_eu_related_content: true } });

        render(<JurisdictionModalComponent {...mock_props} />);

        const title = screen.getByRole('heading');

        expect(title).toBeInTheDocument();
        expect(title).toHaveTextContent('Choose a jurisdiction for your Deriv MT5 CFDs account');
    });
});
