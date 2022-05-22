import React from 'react';
import { render } from '@testing-library/react';
import { CFDAccountCopy } from '../cfd-account-copy';

describe('<CFDAccountCopy />', () => {
    it('component should be rendered', () => {
        const { getByTestId } = render(<CFDAccountCopy />);
        const mainDiv = getByTestId('cfd-account-copy-test');

        expect(mainDiv).toBeInTheDocument();
    });
});
