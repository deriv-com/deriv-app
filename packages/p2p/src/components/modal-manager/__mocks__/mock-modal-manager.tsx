import React from 'react';

type TMockBuySellModalProps = {
    title?: string;
    subtitle?: string;
};

export function MockModal({ title, subtitle }: TMockBuySellModalProps) {
    if (title && subtitle) {
        return (
            <div>
                BuySellModal with {title} and {subtitle}
            </div>
        );
    } else if (title) {
        return <div>BuySellModal with {title}</div>;
    }
    return <div>BuySellModal</div>;
}
