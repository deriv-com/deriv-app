export type TDescription = Pick<TContent, 'type' | 'content' | 'src' | 'imageclass' | 'is_mobile'>;

export type TFaqContent = Pick<TContent, 'title' | 'description' | 'src' | 'search_id'>;

export type TGuideContent = Omit<TContent, 'title' | 'description'>;

export type TUserGuideContent = Omit<TContent, 'title' | 'description'>;

export type TQuickStrategyContent = {
    qs_name: string;
    type: string;
    content: string[];
    search_id: string;
};

export type TContent = {
    content?: string;
    description: TDescription[];
    id: number;
    src?: string;
    subtype?: string;
    title?: string;
    type: string;
    url?: string;
    imageclass?: string;
    search_id: string;
    is_mobile?: boolean;
};
