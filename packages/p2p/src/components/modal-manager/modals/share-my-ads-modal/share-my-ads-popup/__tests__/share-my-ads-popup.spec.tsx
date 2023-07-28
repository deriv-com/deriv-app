import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ShareMyAdsPopup from '../share-my-ads-popup';

const mock_on_close = jest.fn();

describe('<ShareMyAdsPopup />', () => {
    it('should call closePopup function when clicking on cross icon', () => {
        jest.useFakeTimers();

        const el_modal = document.createElement('div');
        el_modal.setAttribute('id', 'modal_root');
        document.body.appendChild(el_modal);

        render(<ShareMyAdsPopup onClose={mock_on_close} />);

        const close_icon = screen.getByTestId('dt-close-popup-icon');
        userEvent.click(close_icon);

        jest.runAllTimers();

        expect(mock_on_close).toHaveBeenCalled();
        document.body.removeChild(el_modal);
    });

    it('should return null if modal_root is not found', () => {
        render(<ShareMyAdsPopup onClose={mock_on_close} />);

        expect(screen.queryByText('Share my ads')).not.toBeInTheDocument();
    });
});
