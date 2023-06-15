import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import WalletContentDivider from '../wallet-content-divider';

describe('<WalletContentDivider />', () => {
    it('Check classname for NOT demo', () => {
        const { container } = render(<WalletContentDivider />);

        expect(container.childNodes[0]).toHaveClass('wallet-content__divider');
        expect(container.childNodes[0]).not.toHaveClass('wallet-content__divider-demo');
    });

    it('Check classname for demo', () => {
        const { container } = render(<WalletContentDivider is_demo_divider={true} />);

        expect(container.childNodes[0]).toHaveClass('wallet-content__divider');
        expect(container.childNodes[0]).toHaveClass('wallet-content__divider-demo');
    });
});
