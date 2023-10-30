import React from 'react';
import { render } from '@testing-library/react';
import { CopyToClipboard } from '../cfd-account-copy';

describe('<CopyToClipboard />', () => {
    it('component should be rendered', () => {
        const { getByTestId } = render(<CopyToClipboard />);
        const mainDiv = getByTestId('cfd_account_copy_main_div');

        expect(mainDiv).toBeInTheDocument();
    });
});
