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

    const labuan_account = {
        class_name: 'cfd-jurisdiction-checkbox',
        is_checked: false,
        jurisdiction_selected_shortcode: 'labuan',
        onCheck: jest.fn(),
        context: mockRootStore,
        should_restrict_bvi_account_creation: false,
        should_restrict_vanuatu_account_creation: false,
    };

    const svg_account = {
        class_name: 'cfd-jurisdiction-checkbox',
        is_checked: false,
        jurisdiction_selected_shortcode: 'svg',
        onCheck: jest.fn(),
        context: mockRootStore,
        should_restrict_bvi_account_creation: false,
        should_restrict_vanuatu_account_creation: false,
    };

    const bvi_account_without_restriction = {
        class_name: 'cfd-jurisdiction-checkbox',
        is_checked: false,
        jurisdiction_selected_shortcode: 'bvi',
        onCheck: jest.fn(),
        context: mockRootStore,
        should_restrict_bvi_account_creation: false,
        should_restrict_vanuatu_account_creation: false,
    };

    const bvi_account_with_restriction = {
        class_name: 'cfd-jurisdiction-checkbox',
        is_checked: false,
        jurisdiction_selected_shortcode: 'bvi',
        onCheck: jest.fn(),
        context: mockRootStore,
        should_restrict_bvi_account_creation: true,
        should_restrict_vanuatu_account_creation: false,
    };

    const vanuatu_account_without_restriction = {
        class_name: 'cfd-jurisdiction-checkbox',
        is_checked: false,
        jurisdiction_selected_shortcode: 'vanuatu',
        onCheck: jest.fn(),
        context: mockRootStore,
        should_restrict_bvi_account_creation: false,
        should_restrict_vanuatu_account_creation: false,
    };

    const vanuatu_account_with_restriction = {
        class_name: 'cfd-jurisdiction-checkbox',
        is_checked: false,
        jurisdiction_selected_shortcode: 'vanuatu',
        onCheck: jest.fn(),
        context: mockRootStore,
        should_restrict_bvi_account_creation: false,
        should_restrict_vanuatu_account_creation: true,
    };
    it('should not render JurisdictionModalCheckbox', () => {
        render(<JurisdictionModalCheckbox {...mock_props} />);
        expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    });

    it('should render labuan account and displays checkbox', () => {
        render(<JurisdictionModalCheckbox {...labuan_account} />);
        expect(screen.queryByRole('checkbox')).toBeInTheDocument();
    });

    it('should render function onCheck when checkbox is clicked for labuan account', () => {
        render(<JurisdictionModalCheckbox {...labuan_account} />);
        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);
        expect(labuan_account.onCheck).toHaveBeenCalled();
    });

    it('should render svg account without displaying checkbox', () => {
        render(<JurisdictionModalCheckbox {...svg_account} />);
        expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    });

    it('should render bvi account without restriction and displays checkbox', () => {
        render(<JurisdictionModalCheckbox {...bvi_account_without_restriction} />);
        expect(screen.queryByRole('checkbox')).toBeInTheDocument();
    });

    it('should render function onCheck when checkbox is clicked for bvi account without restriction', () => {
        render(<JurisdictionModalCheckbox {...bvi_account_without_restriction} />);
        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);
        expect(bvi_account_without_restriction.onCheck).toHaveBeenCalled();
    });

    it('should render bvi account with restriction and does not display checkbox', () => {
        render(<JurisdictionModalCheckbox {...bvi_account_with_restriction} />);
        expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    });

    it('should render vanuatu account without restriction and displays checkbox', () => {
        render(<JurisdictionModalCheckbox {...vanuatu_account_without_restriction} />);
        expect(screen.queryByRole('checkbox')).toBeInTheDocument();
    });

    it('should render function onCheck when checkbox is clicked for vanuatu account without restriction', () => {
        render(<JurisdictionModalCheckbox {...vanuatu_account_without_restriction} />);
        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);
        expect(bvi_account_without_restriction.onCheck).toHaveBeenCalled();
    });

    it('should render vanuatu account with restriction and does not display checkbox', () => {
        render(<JurisdictionModalCheckbox {...vanuatu_account_with_restriction} />);
        expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    });
});
