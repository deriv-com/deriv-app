import React from 'react';
import { render, screen } from '@testing-library/react';
import JurisdictionCardBack from '../jurisdiction-card-back';

describe('<JurisdictionCardBack />', () => {
    type TMockProps = {
        card_classname: string;
        disabled: boolean;
        toggleCardFlip: jest.Mock;
        is_card_selected: boolean;
        verification_docs: (
            | 'document_number'
            | 'name_and_address'
            | 'selfie'
            | 'identity_document'
            | 'not_applicable'
        )[];
    };

    const mock_props: TMockProps = {
        card_classname: 'test_classname',
        disabled: false,
        is_card_selected: false,
        toggleCardFlip: jest.fn(),
        verification_docs: [],
    };

    const exampleVerificationMessage = () => {
        expect(screen.getByText('Your document is pending for verification.')).toBeInTheDocument();
        expect(screen.getByText('Verification failed. Resubmit during account creation.')).toBeInTheDocument();
        expect(screen.getByText('Your document is verified.')).toBeInTheDocument();
    };

    it('should render JurisdictionCardBack without any required submission if verification_docs is empty', () => {
        render(<JurisdictionCardBack {...mock_props} />);
        const container = screen.getByTestId('dt_jurisdiction_card_back');
        expect(container).toHaveClass(
            'test_classname__card-content-container',
            'test_classname__card-flipped-container'
        );
        expect(screen.getByText('We need you to submit these in order to get this account:')).toBeInTheDocument();
        expect(screen.queryByText('A selfie of yourself.')).not.toBeInTheDocument();
        expect(screen.queryByText('Document number (identity card, passport)')).not.toBeInTheDocument();
        expect(
            screen.queryByText(
                'A recent utility bill (electricity, water or gas) or recent bank statement or government-issued letter with your name and address.'
            )
        ).not.toBeInTheDocument();
        expect(
            screen.queryByText('A copy of your identity document (identity card, passport)')
        ).not.toBeInTheDocument();
        exampleVerificationMessage();
    });

    it('should render JurisdictionCardBack display required document_number and name_and_address submission', () => {
        mock_props.verification_docs = ['document_number', 'name_and_address'];
        render(<JurisdictionCardBack {...mock_props} />);
        expect(screen.queryByText('A selfie of yourself.')).not.toBeInTheDocument();
        expect(
            screen.queryByText('A copy of your identity document (identity card, passport)')
        ).not.toBeInTheDocument();
        expect(screen.getByText('We need you to submit these in order to get this account:')).toBeInTheDocument();
        expect(screen.getByText('Document number (identity card, passport)')).toBeInTheDocument();
        expect(
            screen.getByText(
                'A recent utility bill (electricity, water or gas) or recent bank statement or government-issued letter with your name and address.'
            )
        ).toBeInTheDocument();
        exampleVerificationMessage();
    });

    it('should render JurisdictionCardBack display required selfie, identity_document and name_and_address submission', () => {
        mock_props.verification_docs = ['selfie', 'identity_document', 'name_and_address'];
        render(<JurisdictionCardBack {...mock_props} />);
        expect(screen.getByText('We need you to submit these in order to get this account:')).toBeInTheDocument();
        expect(screen.getByText('A selfie of yourself.')).toBeInTheDocument();
        expect(screen.getByText('A copy of your identity document (identity card, passport)')).toBeInTheDocument();
        expect(
            screen.getByText(
                'A recent utility bill (electricity, water or gas) or recent bank statement or government-issued letter with your name and address.'
            )
        ).toBeInTheDocument();
        exampleVerificationMessage();
        expect(screen.queryByText('Document number (identity card, passport)')).not.toBeInTheDocument();
    });

    it('should render JurisdictionCardBack and include selected_card classname if is_card_selected is true', () => {
        mock_props.is_card_selected = true;
        render(<JurisdictionCardBack {...mock_props} />);
        const container = screen.getByTestId('dt_jurisdiction_card_back_container');
        expect(container).toHaveClass('test_classname--selected', 'selected-card');
    });
});
