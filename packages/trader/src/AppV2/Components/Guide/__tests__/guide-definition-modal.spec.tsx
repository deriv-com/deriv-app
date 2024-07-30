import React from 'react';
import { render, screen } from '@testing-library/react';
import { CONTRACT_LIST } from 'AppV2/Utils/trade-types-utils';
import { TERM } from 'AppV2/Utils/contract-description-utils';
import GuideDefinitionModal from '../guide-definition-modal';

const mockProps = {
    contract_type: CONTRACT_LIST.ACCUMULATORS,
    term: TERM.GROWTH_RATE,
    onClose: jest.fn(),
};
const mediaQueryList = {
    matches: true,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
};

window.matchMedia = jest.fn().mockImplementation(() => mediaQueryList);

jest.mock('@lottiefiles/dotlottie-react', () => ({
    DotLottieReact: jest.fn(() => <div>DotLottieReact</div>),
}));

describe('GuideDefinitionModal', () => {
    it('should render a proper content, based on passed props (e.g. for "growth rate" term - a proper explanation)', () => {
        render(<GuideDefinitionModal {...mockProps} />);

        expect(screen.getByText(TERM.GROWTH_RATE)).toBeInTheDocument();
        expect(
            screen.getByText(/You can choose a growth rate with values of 1%, 2%, 3%, 4%, and 5%/i)
        ).toBeInTheDocument();
    });
});
