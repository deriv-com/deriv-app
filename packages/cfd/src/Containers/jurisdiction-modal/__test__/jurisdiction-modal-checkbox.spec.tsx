import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import JurisdictionModalCheckbox from '../jurisdiction-modal-checkbox';
import { StoreProvider, mockStore } from '@deriv/stores';
import { JURISDICTION } from '../../../Helpers/cfd-config';

describe('JurisdictionModalCheckbox', () => {
    const mock_store = mockStore({
        ui: { is_mobile: false },
    });

    const mock_props = {
        class_name: '',
        is_checked: false,
        jurisdiction_selected_shortcode: '',
        onCheck: jest.fn(),
        should_restrict_bvi_account_creation: false,
        should_restrict_vanuatu_account_creation: false,
    };

    const wrapper = ({ children }: { children: JSX.Element }) => (
        <StoreProvider store={mock_store}>{children}</StoreProvider>
    );

    it('should not render JurisdictionModalCheckbox when jurisdiction is not selected', () => {
        render(<JurisdictionModalCheckbox {...mock_props} />, { wrapper });
        expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    });

    it('should render labuan account and displays checkbox', () => {
        render(<JurisdictionModalCheckbox {...mock_props} jurisdiction_selected_shortcode={JURISDICTION.LABUAN} />, {
            wrapper,
        });
        expect(screen.queryByRole('checkbox')).toBeInTheDocument();
    });

    it('should render function onCheck when checkbox is clicked for labuan account', () => {
        render(<JurisdictionModalCheckbox {...mock_props} jurisdiction_selected_shortcode={JURISDICTION.LABUAN} />, {
            wrapper,
        });
        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);
        expect(mock_props.onCheck).toHaveBeenCalled();
    });

    it('should render svg account without displaying checkbox', () => {
        render(<JurisdictionModalCheckbox {...mock_props} jurisdiction_selected_shortcode={JURISDICTION.SVG} />, {
            wrapper,
        });
        expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    });

    it('should render bvi account without restriction and displays checkbox', () => {
        render(<JurisdictionModalCheckbox {...mock_props} jurisdiction_selected_shortcode={JURISDICTION.BVI} />, {
            wrapper,
        });
        expect(screen.queryByRole('checkbox')).toBeInTheDocument();
    });

    it('should render function onCheck when checkbox is clicked for bvi account without restriction', () => {
        render(<JurisdictionModalCheckbox {...mock_props} jurisdiction_selected_shortcode={JURISDICTION.BVI} />, {
            wrapper,
        });
        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);
        expect(mock_props.onCheck).toHaveBeenCalled();
    });

    it('should render bvi account with restriction and does not display checkbox', () => {
        render(
            <JurisdictionModalCheckbox
                {...mock_props}
                jurisdiction_selected_shortcode={JURISDICTION.BVI}
                should_restrict_bvi_account_creation
            />,
            { wrapper }
        );
        expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    });

    it('should render vanuatu account without restriction and displays checkbox', () => {
        render(<JurisdictionModalCheckbox {...mock_props} jurisdiction_selected_shortcode={JURISDICTION.VANUATU} />, {
            wrapper,
        });
        expect(screen.queryByRole('checkbox')).toBeInTheDocument();
    });

    it('should render function onCheck when checkbox is clicked for vanuatu account without restriction', () => {
        render(<JurisdictionModalCheckbox {...mock_props} jurisdiction_selected_shortcode={JURISDICTION.VANUATU} />, {
            wrapper,
        });
        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);
        expect(mock_props.onCheck).toHaveBeenCalled();
    });

    it('should render vanuatu account with restriction and does not display checkbox', () => {
        render(
            <JurisdictionModalCheckbox
                {...mock_props}
                jurisdiction_selected_shortcode={JURISDICTION.VANUATU}
                should_restrict_vanuatu_account_creation
            />,
            { wrapper }
        );
        expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    });
});
