import React from 'react';
import { render } from '@testing-library/react';
import { CFDAccountCopy } from '../cfd-account-copy';

describe('<CFDAccountCopy />', () => {
    it('component should be rendered', () => {
        const { getByTestId } = render(<CFDAccountCopy />);
        const mainDiv = getByTestId('cfd_account_copy_main_div');

        expect(mainDiv).toBeInTheDocument();
    });
});
