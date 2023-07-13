import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdvertiserPageHeader from '../advertiser-page-header';

jest.mock('../../advertiser-page-dropdown-menu', () => jest.fn(() => <div>dropdown menu</div>));
jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    MobileWrapper: jest.fn(({ children }) => children),
}));

const props = {
    onClickPageReturn: jest.fn(),
    is_my_advert: false,
    title: 'Test Title',
};

describe('<AdvertiserPageHeader />', () => {
    it('Should render header component with the passed props', () => {
        render(<AdvertiserPageHeader {...props} />);

        expect(screen.getByText('Test Title')).toBeInTheDocument();
    });
    it('Should call onClickPageReturn function when clicking on back button', () => {
        render(<AdvertiserPageHeader {...props} />);

        const back_button = screen.getByTestId('dt_page_return_icon');
        expect(back_button).toBeInTheDocument();
        userEvent.click(back_button);
        expect(props.onClickPageReturn).toHaveBeenCalledTimes(1);
    });
    it('Should display dropdown menu icon when in mobile view and user is on other advertiser page', () => {
        render(<AdvertiserPageHeader {...props} />);

        expect(screen.getByText('dropdown menu')).toBeInTheDocument();
    });
});
