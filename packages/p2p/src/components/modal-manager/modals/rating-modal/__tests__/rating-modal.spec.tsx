import React from 'react';
import { screen, render } from '@testing-library/react';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { useStores } from 'Stores/index';
import RatingModal from '../rating-modal';

const mock_store: DeepPartial<ReturnType<typeof useStores>> = {
    order_store: {
        rating_value: 0,
        handleRating: jest.fn(),
        setIsRecommended: jest.fn(),
    },
};

const mock_modal_manager: DeepPartial<ReturnType<typeof useModalManagerContext>> = {
    is_modal_open: true,
};

const mock_rating_modal_props = {
    is_buy_order_for_user: true,
    is_user_recommended_previously: 0,
    onClickDone: jest.fn(),
    onClickSkip: jest.fn(),
};

const el_modal = document.createElement('div');

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    ...jest.requireActual('Components/modal-manager/modal-manager-context'),
    useModalManagerContext: jest.fn(() => mock_modal_manager),
}));

describe('<rating-modal.spec />', () => {
    beforeAll(() => {
        el_modal.setAttribute('id', 'modal_root');
        document.body.appendChild(el_modal);
    });

    afterAll(() => {
        document.body.removeChild(el_modal);
    });

    it('should render the RatingModal', () => {
        render(<RatingModal {...mock_rating_modal_props} />);

        expect(screen.getByText('How would you rate this transaction?')).toBeInTheDocument();
    });

    it('should call setIsRecommended with 1 if user presses Yes button', () => {
        mock_store.order_store.rating_value = 4;

        render(<RatingModal {...mock_rating_modal_props} />);

        const yes_button = screen.getByRole('button', { name: 'Yes' });
        yes_button.click();

        expect(mock_store.order_store.setIsRecommended).toHaveBeenCalledWith(1);
    });

    it('should call setIsRecommended with 0 if user presses No button', () => {
        render(<RatingModal {...mock_rating_modal_props} />);

        const no_button = screen.getByRole('button', { name: 'No' });
        no_button.click();

        expect(mock_store.order_store.setIsRecommended).toHaveBeenCalledWith(0);
    });

    it('should call setIsRecommended with null if user presses selected button', () => {
        render(<RatingModal {...mock_rating_modal_props} is_user_recommended_previously={1} />);

        const yes_button = screen.getByRole('button', { name: 'Yes' });
        yes_button.click();

        expect(mock_store.order_store.setIsRecommended).toHaveBeenCalledWith(null);
    });

    it('should call onClickDone when user clicks Done button', () => {
        render(<RatingModal {...mock_rating_modal_props} />);

        const done_button = screen.getByRole('button', { name: 'Done' });
        done_button.click();

        expect(mock_rating_modal_props.onClickDone).toHaveBeenCalled();
    });

    it('should call onClickSkip when user clicks Done button', () => {
        mock_store.order_store.rating_value = 0;

        render(<RatingModal {...mock_rating_modal_props} />);

        const skip_button = screen.getByRole('button', { name: 'Skip' });
        skip_button.click();

        expect(mock_rating_modal_props.onClickSkip).toHaveBeenCalled();
    });
});
