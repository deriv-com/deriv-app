import React from 'react';
import { screen, render, fireEvent } from '@testing-library/react';
import CreateAdModalCard from '../../create-ad-modal-card';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { useStores } from 'Stores';

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    ...jest.requireActual('Components/modal-manager/modal-manager-context'),
    useModalManagerContext: jest.fn().mockReturnValue({
        hideModal: jest.fn(),
        is_modal_open: true,
    }),
}));

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn().mockReturnValue({
        my_ads_store: {
            setAdType: jest.fn(),
            onClickCreate: jest.fn(),
        },
    }),
}));

const props = { title: 'sample Title', text: 'same description text', type: 'normal' };
describe('<CreateAdModalCard/>', () => {
    it('should render the component', () => {
        render(<CreateAdModalCard {...props} />);
        expect(screen.getByText('sample Title')).toBeInTheDocument();
        expect(screen.getByText('same description text')).toBeInTheDocument();
    });
    it('should handle Button Click', () => {
        const { my_ads_store } = useStores();
        const { hideModal } = useModalManagerContext();

        render(<CreateAdModalCard {...props} />);

        const card_button = screen.getByRole('button', { name: 'Choose' });
        expect(card_button).toBeInTheDocument();
        fireEvent.click(card_button);

        expect(my_ads_store.setAdType).toHaveBeenCalledWith('normal');
        expect(my_ads_store.onClickCreate).toHaveBeenCalled();
        expect(hideModal).toHaveBeenCalled();
    });
});
