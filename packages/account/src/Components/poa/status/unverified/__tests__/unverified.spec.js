import React from 'react';
import { screen, render } from '@testing-library/react';
import { Unverified } from '../unverified';

jest.mock('Components/icon-message-content', () => () => <div data-testid='mockedIconMessageContent' />);

describe('<Unverified/>', () => {
    it('should render Unverified component', () => {
        render(<Unverified />);
        expect(screen.getByTestId('mockedIconMessageContent')).toBeInTheDocument();
    });
});
