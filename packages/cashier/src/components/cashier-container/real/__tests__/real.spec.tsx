import React from 'react';
import { render, screen } from '@testing-library/react';
import Real from '../real';

jest.mock('@deriv/components', () => ({
    ...(jest.requireActual('@deriv/components') as any),
    Loading: () => <div>Loading</div>,
}));

describe('<Real />', () => {
    const props = {
        iframe_url: 'https://www.test_url.com',
        clearIframe: jest.fn(),
        iframe_height: '',
        is_loading: false,
    };

    it('should render the component with iframe when iframe_url value is passed', () => {
        render(<Real {...props} />);
        const el_loader = screen.queryByText('Loading');

        expect(el_loader).not.toBeInTheDocument();
        expect(screen.queryByTestId('dt_doughflow_section')).toBeInTheDocument();
    });

    it('should render the loading when is_loading is true', () => {
        render(<Real {...props} iframe_url='' is_loading />);
        const el_loader = screen.queryByText('Loading');

        expect(el_loader).toBeInTheDocument();
        expect(screen.queryByTestId('dt_doughflow_section')).not.toBeInTheDocument();
    });

    it('will display doughflow and loader if all props are provided', () => {
        render(<Real {...props} is_loading />);
        const el_loader = screen.queryByText('Loading');

        expect(el_loader).toBeInTheDocument();
        expect(screen.queryByTestId('dt_doughflow_section')).toBeInTheDocument();
    });
});
