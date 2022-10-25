import React from 'react';

type TIntroCard = {
    label: string;
    content: string[];
    index: number;
    sidebar_item: string[] | any;
};

const Index = (sidebar_item: TIntroCard) => {
    const { label, content, index } = sidebar_item;
    return (
        <div className='db-sidebar__card' key={index}>
            <h1>{label}</h1>
            {content.map((text, key) => (
                <p key={`sidebar-tour${key}`}>{text}</p>
            ))}
        </div>
    );
};

export default Index;
