import React from 'react';

/*
*   TODO: Remove the extra classes when splitting the project.
*   Binary 1.0 and Binary Nex is using different classNames
*   to accomplish the same loader effect.
*
*   Classes for Binary 1.0 :
*       <div className={barspinner dark}
*           <div className={rect${inx+1}}
*
*   Classes for Binary Nex :
*       <div className={barspinner barspinner--${ theme || 'dark'}}
*           <div className={barspinner__rect barspinner__rect--${inx + 1}}
*
*   As a temporary solution, we will add both classes for 1.0 and Nex,
*   however we should remove it in the future.
*/

const Loading = ({ is_invisible, theme, id }) => (
    <div id={id} className={`barspinner barspinner--${ theme || 'dark'}${is_invisible ? ' invisible' : ''} dark`}>
        { Array.from(new Array(5)).map((x, inx) => (
            <div key={inx} className={`barspinner__rect barspinner__rect--${inx + 1} rect${inx + 1}`} />
        ))}
    </div>
);

export default Loading;
