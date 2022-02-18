import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import PageReturn from '../page-return.jsx';

describe('<PageReturn />', () => {
    it('Component should be rendered', () => {
        render(<PageReturn />);

        const el_dp2p_page_return_container = screen.getByTestId('dp2p-page-return_container');

        expect(el_dp2p_page_return_container).toHaveClass('page-return');
    });

    it('Should render proper className passed from props', () => {
        render(<PageReturn className={'test'} />);

        const el_dp2p_page_return_container = screen.getByTestId('dp2p-page-return_container');

        expect(el_dp2p_page_return_container).toHaveClass('test');
    });

    it('function passed from props should be called', () => {
        const mockFunc = jest.fn();
        render(<PageReturn onClick={mockFunc} />);

        const el_dp2p_page_return__icon_container = screen.getByTestId('dp2p-page-return__icon_container');

        fireEvent.click(el_dp2p_page_return__icon_container);

        expect(mockFunc).toHaveBeenCalledTimes(1);
    });

    it('Should show proper text passed from props', () => {
        render(<PageReturn page_title={'test_title'} />);

        const el_dp2p_page_return__test_title = screen.getByText('test_title');

        expect(el_dp2p_page_return__test_title).toBeInTheDocument();
    });
});
