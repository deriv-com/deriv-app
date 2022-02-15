import React from 'react';
import { screen, render } from '@testing-library/react';
import ErrorComponent from '../error-component';

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
    it('should show default message when header message is not passed', () => {
        const header = '';
        render(<ErrorComponent header={header} />);
        expect(screen.getByText('Something’s not right')).toBeInTheDocument();
    });
    it('should show actual message when header message is passed', () => {
        const header = 'Header Text';
        render(<ErrorComponent header={header} />);
        expect(screen.getByText(header)).toBeInTheDocument();
    });
});
