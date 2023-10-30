import React from 'react';
import { render } from '@testing-library/react';
import { CopyTextIcon } from '../cfd-account-copy';

describe('<CopyTextIcon />', () => {
    it('component should be rendered', () => {
        const { getByTestId } = render(<CopyTextIcon />);
        const mainDiv = getByTestId('cfd_account_copy_main_div');

        expect(mainDiv).toBeInTheDocument();
    });
});
