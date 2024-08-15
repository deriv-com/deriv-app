import React from 'react';
import { render, screen } from '@testing-library/react';
import { CONTRACT_LIST } from 'AppV2/Utils/trade-types-utils';
import { getTerm } from 'AppV2/Utils/contract-description-utils';
import GuideDefinitionModal from '../guide-definition-modal';

const mockProps = {
    contract_type: CONTRACT_LIST.ACCUMULATORS,
    term: getTerm().GROWTH_RATE,
    onClose: jest.fn(),
};

jest.mock('@lottiefiles/dotlottie-react', () => ({
    DotLottieReact: jest.fn(() => <div>DotLottieReact</div>),
}));

describe('GuideDefinitionModal', () => {
    it('should render a proper content, based on passed props (e.g. for "growth rate" term - a proper explanation)', () => {
        render(<GuideDefinitionModal {...mockProps} />);

        expect(screen.getByText(getTerm().GROWTH_RATE)).toBeInTheDocument();
        expect(
            screen.getByText(/You can choose a growth rate with values of 1%, 2%, 3%, 4%, and 5%/i)
        ).toBeInTheDocument();
    });
});
