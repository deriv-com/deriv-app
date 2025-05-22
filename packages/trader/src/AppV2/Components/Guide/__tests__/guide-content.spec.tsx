import React from 'react';
import { render, screen } from '@testing-library/react';
import { CONTRACT_LIST, AVAILABLE_CONTRACTS } from 'AppV2/Utils/trade-types-utils';
import GuideContent from '../guide-content';
import userEvent from '@testing-library/user-event';

const mock_props = {
    contract_list: AVAILABLE_CONTRACTS,
    onChipSelect: jest.fn(),
    onTermClick: jest.fn(),
    selected_contract_type: CONTRACT_LIST.ACCUMULATORS,
    show_guide_for_selected_contract: false,
    show_description_in_a_modal: true,
    toggleVideoPlayer: jest.fn(),
    video_src: '',
};

describe('GuideContent', () => {
    it('renders component', () => {
        render(<GuideContent {...mock_props} />);

        AVAILABLE_CONTRACTS.forEach(({ id }) => expect(screen.getByText(id)).toBeInTheDocument());
    });

    it('calls onChipSelect if user clicks on the chip', async () => {
        render(<GuideContent {...mock_props} />);

        expect(mock_props.onChipSelect).not.toHaveBeenCalled();

        const chip = screen.getByText('Vanillas');
        await userEvent.click(chip);

        expect(mock_props.onChipSelect).toHaveBeenCalled();
    });
});
