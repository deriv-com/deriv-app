import React from 'react';

const ListNested = ({ strong, header, items = [], children }) => (
    <li>
        { strong ? <strong>{header}</strong> : header}
        <ol className='reset_ol'>
            { items.map((item, idx) => (
                item.list_nested ?
                    <ListNested key={idx} items={item.list_nested} header={item.header} strong={item.strong} /> :
                    <li key={idx} >{item.text}</li>
            ))}
        </ol>
        {children}
    </li>
);

export default ListNested;
