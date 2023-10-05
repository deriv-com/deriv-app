import React from 'react';
import { render, screen } from '@testing-library/react';
import OpenPositionsSVGModal from '../open-positions-svg-modal';
import { APIProvider } from '@deriv/api';
import { useMT5SVGEligibleToMigrate } from '@deriv/hooks';
import userEvent from '@testing-library/user-event';

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useMT5SVGEligibleToMigrate: jest.fn(() => ({ eligible_account_to_migrate_label: 'BVI' })),
}));

const mockUseMT5SVGEligibleToMigrate = useMT5SVGEligibleToMigrate as jest.MockedFunction<
    typeof useMT5SVGEligibleToMigrate
>;

describe('<OpenPositionsSVGModal/>', () => {
    let modal_root_el: HTMLDivElement;
    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    const mock_props = {
        market_type: 'financial',
        open_order_position_status: true,
        is_modal_open: true,
        setModalOpen: jest.fn(),
    };

    const renderComponent = ({ props = mock_props }) => {
        return render(
            <APIProvider>
                <OpenPositionsSVGModal {...props} />
            </APIProvider>
        );
    };

    it('should render open_order_position_status modal', () => {
        const { container } = renderComponent({ props: mock_props });
        expect(container).toBeInTheDocument();
    });

    it('should render title correctly when open_order_position_status is true', () => {
        renderComponent({ props: mock_props });

        const modal_title = screen.getByText(/No new positions/i);
        expect(modal_title).toBeInTheDocument();
    });

    it('should render title correctly when open_order_position_status is false', () => {
        const new_mock_props = {
            ...mock_props,
            market_type: 'financial',
            open_order_position_status: false,
        };
        renderComponent({ props: new_mock_props });

        const modal_title = screen.getByText(/Account closed/i);
        expect(modal_title).toBeInTheDocument();
    });

    it('should render modal content correctly when open_order_position_status is true and user migrates to BVI', () => {
        // @ts-expect-error need to come up with a way to mock the return type of useMT5SVGEligibleToMigrate
        mockUseMT5SVGEligibleToMigrate.mockReturnValue({
            eligible_account_to_migrate_label: 'BVI',
        });

        renderComponent({ props: mock_props });
        const modal_content_bvi = screen.getByText(
            /You can no longer open new positions with your MT5 Financial SVG account. Please use your MT5 Financial BVI account to open new positions./
        );
        expect(modal_content_bvi).toBeInTheDocument();
    });

    it('should render modal content correctly when open_order_position_status is true and user migrates to Vanuatu', () => {
        // @ts-expect-error need to come up with a way to mock the return type of useMT5SVGEligibleToMigrate
        mockUseMT5SVGEligibleToMigrate.mockReturnValue({
            eligible_account_to_migrate_label: 'Vanuatu',
        });
        renderComponent({ props: mock_props });
        const modal_content_vanuatu = screen.getByText(
            /You can no longer open new positions with your MT5 Financial SVG account. Please use your MT5 Financial Vanuatu account to open new positions./
        );
        expect(modal_content_vanuatu).toBeInTheDocument();
    });

    it('should render modal content correctly when open_order_position_status is true and market_type is derived', () => {
        // @ts-expect-error need to come up with a way to mock the return type of useMT5SVGEligibleToMigrate
        mockUseMT5SVGEligibleToMigrate.mockReturnValue({
            eligible_account_to_migrate_label: 'BVI',
        });
        const mock_props_derived = {
            ...mock_props,
            market_type: 'derived',
            open_order_position_status: true,
        };
        renderComponent({ props: mock_props_derived });

        const modal_content_derived = screen.getByText(
            /You can no longer open new positions with your MT5 Derived SVG account. Please use your MT5 Derived BVI account to open new positions./
        );
        expect(modal_content_derived).toBeInTheDocument();
    });

    it('should render modal content correctly when open_order_position_status is false and market_type is derived', () => {
        const new_mock_props = {
            ...mock_props,
            market_type: 'derived',
            open_order_position_status: false,
        };
        renderComponent({ props: new_mock_props });
        const modal_content = screen.getByText(
            /Your MT5 Derived SVG account will be archived after 30 days of inactivity. You can still access your trade history until the account is archived./
        );
        expect(modal_content).toBeInTheDocument();
    });

    it('should render modal content correctly when open_order_position_status is false and market_type is financial', () => {
        const new_mock_props = {
            ...mock_props,
            market_type: 'financial',
            open_order_position_status: false,
        };
        renderComponent({ props: new_mock_props });
        const modal_content = screen.getByText(
            /Your MT5 Financial SVG account will be archived after 30 days of inactivity. You can still access your trade history until the account is archived./
        );
        expect(modal_content).toBeInTheDocument();
    });

    it('should render poper buttons', () => {
        renderComponent({ props: mock_props });
        const okButton = screen.getByRole('button', { name: /OK/i });
        expect(okButton).toBeInTheDocument();
    });

    it('should call setModalOpen on OK button click', () => {
        renderComponent({ props: mock_props });
        const okButton = screen.getByRole('button', { name: /OK/i });
        userEvent.click(okButton);
        expect(mock_props.setModalOpen).toHaveBeenCalledTimes(1);
    });
});
