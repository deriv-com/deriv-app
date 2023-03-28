import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import JurisdictionModalCheckbox from '../jurisdiction-modal-checkbox';
import RootStore from 'Stores/index';

describe('JurisdictionModalCheckbox', () => {
    const mock_store = {
        client: {},
        common: {},
        ui: {},
    };
    const mockRootStore = new RootStore(mock_store);

    const mock_props = {
        class_name: '',
        is_checked: false,
        jurisdiction_selected_shortcode: '',
        onCheck: jest.fn(),
        context: mockRootStore,
        should_restrict_bvi_account_creation: false,
        should_restrict_vanuatu_account_creation: false,
    };

    it('should not render JurisdictionModalCheckbox when jurisdiction is not selected', () => {
        render(<JurisdictionModalCheckbox {...mock_props} />);
        expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    });

    it('should render labuan account and displays checkbox', () => {
        render(<JurisdictionModalCheckbox {...mock_props} jurisdiction_selected_shortcode='labuan' />);
        expect(screen.queryByRole('checkbox')).toBeInTheDocument();
    });

    it('should render function onCheck when checkbox is clicked for labuan account', () => {
        render(<JurisdictionModalCheckbox {...mock_props} jurisdiction_selected_shortcode='labuan' />);
        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);
        expect(mock_props.onCheck).toHaveBeenCalled();
    });

    it('should render svg account without displaying checkbox', () => {
        render(<JurisdictionModalCheckbox {...mock_props} jurisdiction_selected_shortcode='svg' />);
        expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    });

    it('should render bvi account without restriction and displays checkbox', () => {
        render(<JurisdictionModalCheckbox {...mock_props} jurisdiction_selected_shortcode='bvi' />);
        expect(screen.queryByRole('checkbox')).toBeInTheDocument();
    });

    it('should render function onCheck when checkbox is clicked for bvi account without restriction', () => {
        render(<JurisdictionModalCheckbox {...mock_props} jurisdiction_selected_shortcode='bvi' />);
        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);
        expect(mock_props.onCheck).toHaveBeenCalled();
    });

    it('should render bvi account with restriction and does not display checkbox', () => {
        render(
            <JurisdictionModalCheckbox
                {...mock_props}
                jurisdiction_selected_shortcode='bvi'
                should_restrict_bvi_account_creation
            />
        );
        expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    });

    it('should render vanuatu account without restriction and displays checkbox', () => {
        render(<JurisdictionModalCheckbox {...mock_props} jurisdiction_selected_shortcode='vanuatu' />);
        expect(screen.queryByRole('checkbox')).toBeInTheDocument();
    });

    it('should render function onCheck when checkbox is clicked for vanuatu account without restriction', () => {
        render(<JurisdictionModalCheckbox {...mock_props} jurisdiction_selected_shortcode='vanuatu' />);
        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);
        expect(mock_props.onCheck).toHaveBeenCalled();
    });

    it('should render vanuatu account with restriction and does not display checkbox', () => {
        render(
            <JurisdictionModalCheckbox
                {...mock_props}
                jurisdiction_selected_shortcode='vanuatu'
                should_restrict_vanuatu_account_creation
            />
        );
        expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    });
});
