import React from 'react';
import { render } from '@testing-library/react';
import LoadingCFDRealAccountDisplay from '../loading-cfd-real-account-display';

jest.mock('../../templates/_common/components/loading', () => () => <div>Loading</div>);

describe('<LoadingCFDRealAccountDisplay />', () => {
    it('component should be rendered', () => {
        const { container } = render(<LoadingCFDRealAccountDisplay />);

        expect(container.querySelector('.cfd-real-accounts-display')).toBeInTheDocument();
    });
});
