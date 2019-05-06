import React from 'react';

const UnorderedList = ({ item }) => (
    <ul className={item.ul_class}>
        { item.texts.map((p, idx) => (
            <li key={idx} className={item.li_class || undefined}>{p.li}</li>
        ))}
    </ul>
);

const ListMultiLine = ({ items = [] }) => (
    <ol>
        { items.map((item, idx) => (
            <li key={idx}>
                <strong>{item.header}</strong>
                {item.ul ? <UnorderedList item={item} /> : item.texts.map((p, idx_p) => (<p key={idx_p}>{p.text}</p>))}
            </li>
        ))}
    </ol>
);

export default ListMultiLine;
