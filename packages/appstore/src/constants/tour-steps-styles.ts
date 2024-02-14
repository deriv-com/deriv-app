import { Styles } from 'react-joyride';

type TJoyrideStyles = Pick<Styles, 'options' | 'tooltipTitle' | 'tooltipContent' | 'buttonNext'>;

const tourStyles = {
    options: {
        width: 350,
    },
    tooltipTitle: {
        color: 'var(--brand-red-coral)',
        textAlign: 'left',
    },
    tooltipContent: {
        textAlign: 'left',
        fontSize: '1.6rem',
        padding: '3rem 0 1.6rem 0',
        wordBreak: 'break-word',
        whiteSpace: 'pre-wrap',
    },
    buttonNext: {
        padding: '0.9rem',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        outline: 'none',
    },
} as const;

export const tour_styles: TJoyrideStyles = {
    options: tourStyles.options,
    tooltipTitle: tourStyles.tooltipTitle,
    tooltipContent: tourStyles.tooltipContent,
    buttonNext: tourStyles.buttonNext,
};

export const tour_styles_dark_mode: TJoyrideStyles = {
    options: {
        ...tourStyles.options,
        backgroundColor: 'var(--general-section-3)',
        arrowColor: 'var(--general-section-3)',
    },
    tooltipTitle: tourStyles.tooltipTitle,
    tooltipContent: tourStyles.tooltipContent,
    buttonNext: tourStyles.buttonNext,
};
