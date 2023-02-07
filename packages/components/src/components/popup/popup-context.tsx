import React from 'react';

export type TDetail = {
    id?: string;
    icon?: string;
    has_footer_separator: boolean;
    renderBody?: React.ElementType;
    renderFooter?: React.ElementType;
    title?: string;
};

export type TPopupContext = {
    active_tab_icon_color: string;
    balance: number | string;
    Component: React.ElementType;
    currency: string;
    close_icon_color: string;
    header_background_color: string;
    header_big_text: string;
    header_banner_text: string;
    header_button_text: string;
    header_contents_color?: string;
    header_content_color?: string;
    header_icon: string;
    is_overlay_shown: boolean;
    onHeaderButtonClick?: () => void;
    overlay_ref?: HTMLDivElement | null;
    setIsOverlayShown?: React.Dispatch<React.SetStateAction<boolean>>;
    should_show_popup: boolean;
    tab_icon_color: string;
    tabs_detail: TDetail[];
    title: string;
    togglePopupModal: () => void;
};

const PopupContext = React.createContext<TPopupContext>({
    active_tab_icon_color: '',
    balance: '',
    currency: '',
    close_icon_color: '',
    header_background_color: '',
    header_big_text: '',
    header_banner_text: '',
    header_button_text: '',
    header_content_color: '',
    header_icon: '',
    is_overlay_shown: false,
    should_show_popup: false,
    title: '',
    tab_icon_color: '',
    tabs_detail: [{ has_footer_separator: false }],
    Component: 'symbol',
    togglePopupModal: () => '',
});

export default PopupContext;
