import React from 'react';
import { screen, render } from '@testing-library/react';
import JurisdictionTitleIndicator from '../jurisdiction-title-indicator';
import { TJurisdictionTitleIndicatorProps } from 'Containers/props.types';
import { Jurisdiction } from '@deriv/shared';

describe('JurisdictionTitleIndicator', () => {
    const mock_props: TJurisdictionTitleIndicatorProps = {
        title_indicators: {
            type: 'displayText',
            display_text: 'Test Display Text',
        },
        type_of_card: Jurisdiction.BVI,
        verification_docs: ['not_applicable'],
    };
    it('should render JurisdictionTitleIndicator with displayText', () => {
        render(<JurisdictionTitleIndicator {...mock_props} />);
        expect(screen.getByText('Test Display Text')).toBeInTheDocument();
    });

    it('should render JurisdictionTitleIndicator with displayIcons', () => {
        mock_props.title_indicators.type = 'displayIcons';
        render(<JurisdictionTitleIndicator {...mock_props} />);
        expect(screen.getByTestId('dt_jurisdiction_title_indicator_icon')).toBeInTheDocument();
    });

    it('should render JurisdictionTitleIndicator with displayIcons and Default icon variant', () => {
        mock_props.title_indicators.type = 'displayIcons';
        mock_props.verification_docs = ['document_number'];
        render(<JurisdictionTitleIndicator {...mock_props} />);
        expect(screen.getByTestId('dt_jurisdiction_title_indicator_Default_icon')).toBeInTheDocument();
    });

    it('should render JurisdictionTitleIndicator with displayIcons and Pending icon variant', () => {
        const new_mock_props: TJurisdictionTitleIndicatorProps = {
            ...mock_props,
            title_indicators: {
                type: 'displayIcons',
                display_text: 'Test Display Text',
            },
            verification_docs: ['document_number'],
        };
        render(<JurisdictionTitleIndicator {...new_mock_props} />);
        expect(screen.getByTestId('dt_jurisdiction_title_indicator_Pending_icon')).toBeInTheDocument();
    });

    it('should render JurisdictionTitleIndicator with displayIcons and Failed icon variant', () => {
        const new_mock_props: TJurisdictionTitleIndicatorProps = {
            ...mock_props,
            title_indicators: {
                type: 'displayIcons',
                display_text: 'Test Display Text',
            },
            verification_docs: ['document_number'],
        };
        render(<JurisdictionTitleIndicator {...new_mock_props} />);
        expect(screen.getByTestId('dt_jurisdiction_title_indicator_Failed_icon')).toBeInTheDocument();
    });

    it('should render JurisdictionTitleIndicator with displayIcons and Verified icon variant', () => {
        const new_mock_props: TJurisdictionTitleIndicatorProps = {
            ...mock_props,
            title_indicators: {
                type: 'displayIcons',
                display_text: 'Test Display Text',
            },
            verification_docs: ['document_number'],
        };
        render(<JurisdictionTitleIndicator {...new_mock_props} />);
        expect(screen.getByTestId('dt_jurisdiction_title_indicator_Verified_icon')).toBeInTheDocument();
    });

    it('should render JurisdictionTitleIndicator with displayIcons and Pending icon variant with type_of_card to be Vanuatu', () => {
        const new_mock_props: TJurisdictionTitleIndicatorProps = {
            ...mock_props,
            title_indicators: {
                type: 'displayIcons',
                display_text: 'Test Display Text',
            },
            type_of_card: Jurisdiction.VANUATU,
            verification_docs: ['selfie'],
        };
        render(<JurisdictionTitleIndicator {...new_mock_props} />);
        expect(screen.getByTestId('dt_jurisdiction_title_indicator_Pending_icon')).toBeInTheDocument();
    });

    it('should render JurisdictionTitleIndicator with displayIcons and Pending icon variant with type_of_card to be MaltaInvest', () => {
        const new_mock_props: TJurisdictionTitleIndicatorProps = {
            ...mock_props,
            title_indicators: {
                type: 'displayIcons',
                display_text: 'Test Display Text',
            },
            type_of_card: Jurisdiction.MALTA_INVEST,
            verification_docs: ['identity_document'],
        };
        render(<JurisdictionTitleIndicator {...new_mock_props} />);
        expect(screen.getByTestId('dt_jurisdiction_title_indicator_Pending_icon')).toBeInTheDocument();
    });

    it('should render JurisdictionTitleIndicator with displayIcons and Failed icon variant with type_of_card to be Vanuatu', () => {
        const new_mock_props: TJurisdictionTitleIndicatorProps = {
            ...mock_props,
            title_indicators: {
                type: 'displayIcons',
                display_text: 'Test Display Text',
            },
            type_of_card: Jurisdiction.VANUATU,
            verification_docs: ['selfie'],
        };
        render(<JurisdictionTitleIndicator {...new_mock_props} />);
        expect(screen.getByTestId('dt_jurisdiction_title_indicator_Failed_icon')).toBeInTheDocument();
    });

    it('should render JurisdictionTitleIndicator with displayIcons and Verified icon variant with type_of_card to be Vanuatu', () => {
        const new_mock_props: TJurisdictionTitleIndicatorProps = {
            ...mock_props,
            title_indicators: {
                type: 'displayIcons',
                display_text: 'Test Display Text',
            },
            type_of_card: Jurisdiction.VANUATU,
            verification_docs: ['selfie'],
        };
        render(<JurisdictionTitleIndicator {...new_mock_props} />);
        expect(screen.getByTestId('dt_jurisdiction_title_indicator_Verified_icon')).toBeInTheDocument();
    });

    it('should render JurisdictionTitleIndicator with displayIcons and Pending icon variant when verification_document is name_and_address and type_of_card to be svg', () => {
        const new_mock_props: TJurisdictionTitleIndicatorProps = {
            ...mock_props,
            title_indicators: {
                type: 'displayIcons',
                display_text: 'Test Display Text',
            },
            type_of_card: Jurisdiction.SVG,
            verification_docs: ['name_and_address'],
        };
        render(<JurisdictionTitleIndicator {...new_mock_props} />);
        expect(screen.getByTestId('dt_jurisdiction_title_indicator_Pending_icon')).toBeInTheDocument();
    });

    it('should render JurisdictionTitleIndicator with displayIcons and Failed icon variant when verification_document is name_and_address and type_of_card to be svg', () => {
        const new_mock_props: TJurisdictionTitleIndicatorProps = {
            ...mock_props,
            title_indicators: {
                type: 'displayIcons',
                display_text: 'Test Display Text',
            },
            type_of_card: Jurisdiction.SVG,
            verification_docs: ['name_and_address'],
        };
        render(<JurisdictionTitleIndicator {...new_mock_props} />);
        expect(screen.getByTestId('dt_jurisdiction_title_indicator_Failed_icon')).toBeInTheDocument();
    });

    it('should render JurisdictionTitleIndicator with displayIcons and Verified icon variant when verification_document is name_and_address and type_of_card to be svg', () => {
        const new_mock_props: TJurisdictionTitleIndicatorProps = {
            ...mock_props,
            title_indicators: {
                type: 'displayIcons',
                display_text: 'Test Display Text',
            },
            type_of_card: Jurisdiction.SVG,
            verification_docs: ['name_and_address'],
        };
        render(<JurisdictionTitleIndicator {...new_mock_props} />);
        expect(screen.getByTestId('dt_jurisdiction_title_indicator_Verified_icon')).toBeInTheDocument();
    });
});
