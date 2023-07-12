import React from 'react'

export function MockModal({ title, subtitle }: { title?: string; subtitle?: string }) {
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