import React from 'react';

const Patents = ({ items }) => (
    <ul>
        { items.map((item, idx) => (
            <li key={idx}>
                <a target='_blank' href={`https://www.google.com/patents/${item.doc}`} rel='noopener noreferrer'>{item.text}</a>
            </li>
        ))}
    </ul>
);

const USPatents = () => (
    <div className='static_full'>
        <h1>{it.L('US Patents')}</h1>
        <Patents
            items={[
                { doc: 'US7206762', text: it.L('Betting system and method') },
                { doc: 'US8046293', text: it.L('Computer trading system for offering custom financial market speculations') },
                { doc: 'US8046292', text: it.L('Computer system and method for speculating on a financial market') },
            ]}
        />
    </div>
);

export default USPatents;
