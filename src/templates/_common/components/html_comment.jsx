import React from 'react';

const HTMLComment = ({ children }) => (
    <span className='invisible' dangerouslySetInnerHTML={{ __html: `<!-- ${children} -->` }} />
);

export default HTMLComment;
