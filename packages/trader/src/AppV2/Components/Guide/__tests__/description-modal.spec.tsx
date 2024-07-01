import React from 'react';
import { render, screen } from '@testing-library/react';
import { CONTRACT_LIST, AVAILABLE_CONTRACTS } from 'AppV2/Utils/trade-types-utils';
import DescriptionModal from '../decription-modal';

const mockProps = {
    is_open: true,
    onClose: jest.fn(),
    onChipSelect: jest.fn(),
    onTermClick: jest.fn(),
    selected_contract_type: CONTRACT_LIST.ACCUMULATORS,
};
const mediaQueryList = {
    matches: true,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
};

window.matchMedia = jest.fn().mockImplementation(() => mediaQueryList);

describe('DescriptionModal', () => {
    it('should render component', () => {
        render(<DescriptionModal {...mockProps} />);

        AVAILABLE_CONTRACTS.forEach(({ id }) => expect(screen.getByText(id)).toBeInTheDocument());
        expect(screen.getByText('Got it')).toBeInTheDocument();
    });
});
