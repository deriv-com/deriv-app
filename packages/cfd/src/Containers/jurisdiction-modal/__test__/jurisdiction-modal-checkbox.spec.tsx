import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import JurisdictionModalCheckbox from '../jurisdiction-modal-checkbox';
import { StoreProvider, mockStore } from '@deriv/stores';
import { JURISDICTION } from '../../../Helpers/cfd-config';

describe('JurisdictionModalCheckbox', () => {
    const mock_props = {
        class_name: '',
        is_checked: false,
        jurisdiction_selected_shortcode: '',
        onCheck: jest.fn(),
        should_restrict_bvi_account_creation: false,
        should_restrict_vanuatu_account_creation: false,
    };

    const renderComponent = (props = mock_props) => {
        render(
            <StoreProvider store={mockStore({})}>
                <JurisdictionModalCheckbox {...props} />
            </StoreProvider>
        );
    };

    it('should not render JurisdictionModalCheckbox when jurisdiction is not selected', () => {
        renderComponent({ ...mock_props });
        expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    });

    it('should render labuan account and displays checkbox', () => {
        renderComponent({ ...mock_props, jurisdiction_selected_shortcode: JURISDICTION.LABUAN });
        expect(screen.queryByRole('checkbox')).toBeInTheDocument();
    });

    it('should render function onCheck when checkbox is clicked for labuan account', () => {
        renderComponent({ ...mock_props, jurisdiction_selected_shortcode: JURISDICTION.LABUAN });
        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);
        expect(mock_props.onCheck).toHaveBeenCalled();
    });

    it('should render svg account without displaying checkbox', () => {
        renderComponent({ ...mock_props, jurisdiction_selected_shortcode: JURISDICTION.SVG });
        expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    });

    it('should render bvi account without restriction and displays checkbox', () => {
        renderComponent({ ...mock_props, jurisdiction_selected_shortcode: JURISDICTION.BVI });
        expect(screen.queryByRole('checkbox')).toBeInTheDocument();
    });

    it('should render function onCheck when checkbox is clicked for bvi account without restriction', () => {
        renderComponent({ ...mock_props, jurisdiction_selected_shortcode: JURISDICTION.BVI });
        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);
        expect(mock_props.onCheck).toHaveBeenCalled();
    });

    it('should render bvi account with restriction and does not display checkbox', () => {
        renderComponent({
            ...mock_props,
            jurisdiction_selected_shortcode: JURISDICTION.BVI,
            should_restrict_bvi_account_creation: true,
        });
        expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    });

    it('should render vanuatu account without restriction and displays checkbox', () => {
        renderComponent({
            ...mock_props,
            jurisdiction_selected_shortcode: JURISDICTION.VANUATU,
        });
        expect(screen.queryByRole('checkbox')).toBeInTheDocument();
    });

    it('should render function onCheck when checkbox is clicked for vanuatu account without restriction', () => {
        renderComponent({
            ...mock_props,
            jurisdiction_selected_shortcode: JURISDICTION.VANUATU,
        });
        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);
        expect(mock_props.onCheck).toHaveBeenCalled();
    });

    it('should render vanuatu account with restriction and does not display checkbox', () => {
        renderComponent({
            ...mock_props,
            jurisdiction_selected_shortcode: JURISDICTION.VANUATU,
            should_restrict_vanuatu_account_creation: true,
        });
        expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    });
});
