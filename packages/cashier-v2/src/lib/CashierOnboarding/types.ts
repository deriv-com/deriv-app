import { IconTypes } from '@deriv/quill-icons';

export type TIcons = { icon: IconTypes; key: string };

export type TOnboardingIconsType = {
    dark: TIcons[];
    light: TIcons[];
};
