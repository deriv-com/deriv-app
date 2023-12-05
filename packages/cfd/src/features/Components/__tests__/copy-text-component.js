import React from 'react';
import { render } from '@testing-library/react';
import { CopyTextComponent } from '../copy-text-component';

describe('<CopyTextComponent />', () => {
    it('component should be rendered', () => {
        const { getByTestId } = render(<CopyTextComponent />);
        const mainDiv = getByTestId('cfd_account_copy_main_div');

        expect(mainDiv).toBeInTheDocument();
    });
});
