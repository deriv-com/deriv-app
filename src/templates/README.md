jsx Rules
=============

- Use functional stateless components (`FSC`).
- Use destructuring to capture parameters if needed.
- Use `{condition && <el/> ...</el>}` syntax to conditionally render an element.
- Use `<el attr={value || undefined}` to conditionally render an attribute, React omits attributes with null or undefined values.
- Use `it.L('...')` for translations.
- Use `it.url_for('...')` to build URLs.
- Use `it.website_name` instead of `Binary.com`.
- Do NOT use `<Element attributeName={true} />`; just use `<Element attributeName />`.
- Components with less than four arguments should stay list all in one line, for example:

```
export const List = ({ items, id, className }) => (
    <React.Fragment>
        { items.length ?
          <ul id={id} className={className}>
              {items.map((item, idx) => <Li key={idx} {...item} />)}
          </ul>
        :
          undefined
        }
    </React.Fragment>

);
```

- Components with more than four arguments need to be broken down to separate lines, for example:

```
export const Li = ({
    className,
    id,
    href,
    param = '',
    target,
    text,
    header,
    p,
}) => {
    const content = p ? <p>{text}</p> : text;

    return (
        <li id={id} className={className}>
            { header && (
                text ? <strong>{header}</strong> : <h3>{header}</h3>
            )}
            { href ?
                <a
                    href={`${href}${param}`}
                    rel={/^http/.test(href) ? 'noopener noreferrer' : undefined}
                    target={target || undefined}
                >
                    {content}
                </a>
                : content
            }
        </li>
    );
};
```

- Imports with four or more arguments need to be broken down to separate lines, but lower than that should stay in one line.
- Always name your components before default exporting them, for example:

```
import React from 'react';

const Loading = ({theme}) => (
    <div className={`barspinner ${ theme || 'dark'}`}>
        { Array.from(new Array(5)).map((x, inx) => (
            <div key={inx} className={`rect${inx + 1}`}></div>
        ))}
    </div>
);

export default Loading;
```
- There are cases where you do not want your strings to be escaped (i.g. when you place `<a/>` tags inside a `<Table />`). To bypass HTML escape, you can use `it.dangreouslyRenderHtml()` (under normal circumstances do NOT use this.):

```
it.dangreouslyRenderHtml('<a href="https://binary.com"></a>');
```

- Blocks need to have a single space after `{`, for example:

```
{ array.map[() => ())}
```

- Functions should be named using CamelCase.
- Variable should be named using lower_case.
