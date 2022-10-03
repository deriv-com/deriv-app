export type TAccordionItem = Array<{
    header: string;
    content: React.ReactNode;
}>;

export type TAccordionProps = {
    className?: string;
    icon_close?: string;
    icon_open?: string;
    list: TAccordionItem;
};
