import React from 'react';
import { render, screen } from '@testing-library/react';
import Withdraw from '../withdraw';

jest.mock('Stores/connect', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

jest.mock('Components/cashier-container/real', () => jest.fn(() => 'mockedReal'));

describe('<Withdraw />', () => {
    it('should render the cashier container component', () => {
        const clearIframe = jest.fn();
        const onMount = jest.fn();
        const setActiveTab = jest.fn();
        const verification_code = '9fOzRypP';

        render(
            <Withdraw
                clearIframe={clearIframe}
                container={'withdraw'}
                iframe_url={'https://cashier.deriv.com'}
                onMount={onMount}
                setActiveTab={setActiveTab}
                verification_code={verification_code}
            />
        );

        expect(onMount).toHaveBeenCalledWith(verification_code);
        expect(screen.getByText('mockedReal')).toBeInTheDocument();
    });
});
