import React from 'react';
import { render, screen } from '@testing-library/react';
import ContractTypeDialog from '../contract-type-dialog.jsx';
import { isMobile, isDesktop } from '@deriv/shared';

jest.mock('@deriv/shared/src/utils/screen/responsive', () => ({
    ...jest.requireActual('@deriv/shared/src/utils/screen/responsive'),
    isMobile: jest.fn(),
    isDesktop: jest.fn(() => true),
}));

const MockContractTypeDialog = () => (
    <ContractTypeDialog
        is_open
        categories={[]}
        list={[
            { contract_types: [{ value: 'first-value' }], label: 'first-item' },
            { contract_types: [{ value: 'second-value' }], label: 'second-item' },
        ]}
    >
        <div data-testid='dt_child' />
    </ContractTypeDialog>
);

describe('ContractTypeDialog Component', () => {
    let modal_root_el: HTMLDivElement;

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => document.body.removeChild(modal_root_el));
    beforeEach(() => jest.clearAllMocks());

    it('should render "children" when passed in', () => {
        render(<MockContractTypeDialog />);
        expect(screen.getByTestId('dt_child')).toBeInTheDocument();
    });

    it('should render "ContractTypeMenu" component in the desktop view', () => {
        render(<MockContractTypeDialog />);
        expect(screen.getByText('Trade types')).toBeInTheDocument();
        expect(screen.getByTestId('dt_contract_wrapper')).toBeInTheDocument();
    });

    it('should render "MobileDialog" component in the mobile view', () => {
        (isMobile as jest.Mock).mockReturnValue(true);
        (isDesktop as jest.Mock).mockReturnValue(false);
        render(<MockContractTypeDialog />);
        expect(screen.getByTestId('dt_mobile_dialog')).toBeInTheDocument();
    });
});
