import React from 'react';
import { screen, render } from '@testing-library/react';
import Loading from '../loading';

describe('Loading', () => {
    it('should render with default props', () => {
        const { container } = render(<Loading />);
        expect(screen.getByTestId('cfd_loading_main_div')).toHaveClass('initial-loader--fullscreen');
        expect(screen.getByTestId('cfd_loading_spinner')).toHaveClass('barspinner-light');
        // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
        const childDivs = container.querySelectorAll('.initial-loader__barspinner--rect');
        expect(childDivs).toHaveLength(5);

        childDivs.forEach((div, index) => {
            expect(div).toHaveClass(`barspinner__rect barspinner__rect--${index + 1} rect${index + 1}`);
        });
    });

    it('should render correctly with provided props', () => {
        const statusMessages = ['Loading...', 'Please wait...'];
        render(
            <Loading
                className='test-class'
                id='test-id'
                is_fullscreen={false}
                is_slow_loading={true}
                status={statusMessages}
                theme='dark'
            />
        );
        const mainDiv = screen.getByTestId('cfd_loading_main_div');
        expect(mainDiv).toHaveClass('test-class');
        expect(mainDiv).not.toHaveClass('initial-loader--fullscreen');
        const spinnerDiv = screen.getByTestId('cfd_loading_spinner');
        expect(spinnerDiv).toHaveClass('barspinner-dark');
        expect(spinnerDiv).toHaveAttribute('id', 'test-id');
        statusMessages.forEach(message => {
            expect(screen.getByText(message)).toBeInTheDocument();
        });
    });

    it('should not render status when is_slow_loading is false', () => {
        const statusMessages = ['Loading...', 'Please wait...'];
        render(<Loading is_slow_loading={false} status={statusMessages} />);
        statusMessages.forEach(message => {
            expect(screen.queryByText(message)).not.toBeInTheDocument();
        });
    });
});
