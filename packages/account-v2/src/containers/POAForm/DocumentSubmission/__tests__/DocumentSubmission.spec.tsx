import React from 'react';
import { render, screen } from '@testing-library/react';
import { getExampleImagesConfig } from '../../CommonMistakeExample';
import { DocumentSubmission } from '../DocumentSubmission';

jest.mock('../../../../components/FormFields', () => ({
    ...jest.requireActual('../../../../components/FormFields'),
    FormDocumentUploadField: () => <div>FormDocumentUploadField</div>,
}));

jest.mock('../../CommonMistakeExample', () => ({
    ...jest.requireActual('../../CommonMistakeExample'),
    CommonMistakesExamples: ({ description }: { description: string }) => (
        <div data-testid='dt_common_mistake_example'>{description}</div>
    ),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isMobile: false })),
}));

describe('DocumentSubmission', () => {
    beforeEach(() => {
        render(<DocumentSubmission />);
    });

    it('renders the Document Submission title', () => {
        expect(screen.getByText('Document Submission')).toBeInTheDocument();
    });

    it('renders the document submission instructions', () => {
        const instructions =
            'We accept only these types of documents as proof of address. The document must be recent (issued within last 6 months) and include your name and address:';
        expect(screen.getByText(instructions)).toBeInTheDocument();
    });

    it('renders the list of acceptable documents', () => {
        const listItems = [
            'Utility bill: electricity, water, gas, or landline phone bill.',
            'Financial, legal, or government document: recent bank statement, affidavit, or government-issued letter.',
            'Home rental agreement: valid and current agreement.',
        ];

        listItems.forEach(item => {
            expect(screen.getByText(item)).toBeInTheDocument();
        });
    });

    it('renders the Common Mistake', () => {
        expect(screen.getByText('Common Mistakes')).toBeInTheDocument();
        const commonMistakeExamples = getExampleImagesConfig();
        const examples = screen.getAllByTestId('dt_common_mistake_example');
        commonMistakeExamples.forEach((example, index) => {
            expect(examples[index]).toHaveTextContent(example.description);
        });
    });
});
