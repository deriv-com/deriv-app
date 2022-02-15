import React from 'react';
import { screen, render } from '@testing-library/react';
import ErrorComponent from '../error-component';

// jest.mock('@deriv/components', () => ({
//     ...jest.requireActual('@deriv/components'),
//     // eslint-disable-next-line react/display-name
//     PageError: () => <div>PageError</div>,
// }));

describe('<ErrorComponent/>', () => {
    it('should show the default message when message is not passed', () => {
        const message = '';
        render(<ErrorComponent message={message} />);
        expect(screen.getByText('Sorry, an error occured while processing your request.')).toBeInTheDocument();
    });

    it('should show the actual message when message is passed', () => {
        const message = 'This is the error message';
        render(<ErrorComponent message={message} />);
        expect(screen.getByText(message)).toBeInTheDocument();
    });

    it('should show refresh message when should_show_refresh is true', () => {
        render(<ErrorComponent should_show_refresh={true} />);
        expect(screen.getByText('Please refresh this page to continue.')).toBeInTheDocument();
    });

    // it('should show refresh text when redirect_label is true ', () => {
    //     render(<ErrorComponent redirect_label={true}/>);
    //     expect(screen.getByText('Refresh')).toBeInTheDocument();
    // });
});
