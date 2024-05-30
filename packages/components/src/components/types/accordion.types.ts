export type TAccordionItem = Array<{
    header: string;
    content: React.ReactNode;
}>;

export type TAccordionProps = {
    className?: string;
    icon_close?: React.ReactNode;
    icon_open?: React.ReactNode;
    list: TAccordionItem;
};
