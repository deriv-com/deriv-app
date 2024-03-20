import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RatingModal, { TRatingModalProps } from '../RatingModal';

let mockProps: TRatingModalProps = {
    isBuyOrder: true,
    isModalOpen: true,
    isRecommendedPreviously: null,
    onRequestClose: jest.fn(),
    ratingValue: 0,
};

const disabledClassName = 'p2p-v2-rating-modal__button--disabled';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: () => ({ isMobile: false }),
}));

describe('<RatingModal />', () => {
    it('should render just the star rating initially', () => {
        render(<RatingModal {...mockProps} />);

        expect(screen.getByText('How would you rate this transaction?')).toBeInTheDocument();
        expect(screen.getByTestId('dt_p2p_v2_rating_modal_stars')).toBeInTheDocument();
        expect(screen.queryByText('Would you recommend this buyer?')).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Yes' })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'No' })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Done' })).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Skip' })).toBeInTheDocument();
    });

    it('should show the recommendation buttons if ratingValue is passed ', () => {
        mockProps = { ...mockProps, ratingValue: 4 };
        render(<RatingModal {...mockProps} />);

        expect(screen.getByText('Would you recommend this buyer?')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Yes' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'No' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Done' })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Skip' })).not.toBeInTheDocument();
    });

    it('should enable the Yes button when clicked and disabled the No button if isRecommendedPreviously is 0', () => {
        mockProps = { ...mockProps, isRecommendedPreviously: 0 };

        render(<RatingModal {...mockProps} />);

        const noButton = screen.getByRole('button', { name: 'No' });
        expect(noButton).not.toHaveClass(disabledClassName);

        const yesButton = screen.getByRole('button', { name: 'Yes' });
        userEvent.click(yesButton);

        expect(yesButton).not.toHaveClass(disabledClassName);
        expect(noButton).toHaveClass(disabledClassName);
    });

    it('should enable the No button when clicked and disabled the Yes button if isRecommendedPreviously is 1', () => {
        mockProps = { ...mockProps, isRecommendedPreviously: 1 };

        render(<RatingModal {...mockProps} />);

        const yesButton = screen.getByRole('button', { name: 'Yes' });
        expect(yesButton).not.toHaveClass(disabledClassName);

        const noButton = screen.getByRole('button', { name: 'No' });
        userEvent.click(noButton);

        expect(noButton).not.toHaveClass(disabledClassName);
        expect(yesButton).toHaveClass(disabledClassName);
    });
});
