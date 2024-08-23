import React from 'react';
import { screen, render } from '@testing-library/react';
import { useDevice } from '@deriv-com/ui';
import BlockUserEmpty from '..';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn().mockReturnValue({ isDesktop: true }),
}));

describe('<BlockUserEmpty />', () => {
    it('should render <BlockUserEmpty/> component in desktop view', () => {
        render(<BlockUserEmpty />);
        expect(screen.getByTestId('dt_desktop_content')).toBeInTheDocument();
        expect(screen.getByText('No one to show here')).toBeInTheDocument();
    });
    it('should render <BlockUserEmpty /> component in mobile view', () => {
        (useDevice as jest.Mock).mockReturnValueOnce({ isDesktop: false });
        render(<BlockUserEmpty />);
        expect(screen.queryByTestId('dt_desktop_content')).not.toBeInTheDocument();
        expect(screen.getByText('No one to show here')).toBeInTheDocument();
    });
});
