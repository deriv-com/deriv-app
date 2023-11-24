import React from 'react';
import { render } from '@testing-library/react';
import { CopyTextIcon } from '../copy-text-icon';

describe('<CopyTextIcon />', () => {
    it('component should be rendered', () => {
        const { getByTestId } = render(<CopyTextIcon />);
        const mainDiv = getByTestId('copy_text_icon_main_div');

        expect(mainDiv).toBeInTheDocument();
    });
});
