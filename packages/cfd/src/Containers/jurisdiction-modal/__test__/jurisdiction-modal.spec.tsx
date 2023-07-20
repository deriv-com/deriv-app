import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { CFDStoreProvider } from 'Stores/Modules/CFD/Helpers/useCfdStores';
import JurisdictionModal from '../jurisdiction-modal';
import { TJurisdictionModalProps } from 'Containers/props.types';

jest.mock('@deriv/shared/src/utils/screen/responsive', () => ({
    ...jest.requireActual('@deriv/shared/src/utils/screen/responsive'),
    isMobile: jest.fn(),
    isDesktop: jest.fn(() => true),
}));

jest.mock('../jurisdiction-modal-content-wrapper', () =>
    jest.fn(() => <div data-testid='jurisdiction-modal-content-wrapper' />)
);
jest.mock('../../dynamic-leverage/dynamic-leverage-modal-content', () =>
    jest.fn(() => <div data-testid='dynamic-leverage-modal-content' />)
);

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

const store = mockStore(mock_store);

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

    it.only('should render JurisdictionModal', () => {
        render(<JurisdictionModalComponent {...mock_props} />);
        // screen.debug();
        // expect(screen.getByTestId('jurisdiction-modal')).toBeInTheDocument();
    });

    it('should render JurisdictionModal with dynamic leverage modal title', async () => {
        const setIsDynamicLeverageVisible = jest.fn();
        jest.spyOn(React, 'useState').mockImplementationOnce(() => [true, setIsDynamicLeverageVisible]);

        render(<JurisdictionModalComponent {...mock_props} />);

        const title = screen.getByText('Get more out of Deriv MT5 Financial');
        const backIcon = screen.getByTestId('back_icon');

        expect(title).toBeInTheDocument();
        expect(backIcon).toBeInTheDocument();

        fireEvent.click(backIcon);
        await waitFor(() => {
            expect(setIsDynamicLeverageVisible).toHaveBeenCalledWith(false);
        });
    });
});
