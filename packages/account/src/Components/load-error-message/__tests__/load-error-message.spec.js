import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadErrorMessage from '../load-error-message';

jest.mock('Components/icon-message-content', () => () => (<div>IconMessageContent</div>));

describe('LoadErrorMessage', () => {
    it('should render LoadErrorMessage component', () => {
        render(<LoadErrorMessage message="message"/>);
        expect(screen.getByText('IconMessageContent')).toBeInTheDocument();
    });
})
