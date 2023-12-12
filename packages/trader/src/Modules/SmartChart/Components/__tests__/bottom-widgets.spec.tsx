import React from 'react';
import { screen, render } from '@testing-library/react';
import BottomWidgets from '../bottom-widgets';

describe('<BottomWidgets />', () => {
    it('Should render mocked widget as a child', () => {
        const mock_widget = <div>MockWidget</div>;
        render(<BottomWidgets Widget={mock_widget} />);
        expect(screen.getByText(/mockwidget/i)).toBeInTheDocument();
    });
});
