# JavaScript Guidelines

**In this document**

-   [General Guidelines](#general-guidelines)
-   [Style Guide](#style-guide)
-   [JSX Rules](#jsx-rules)

## General Guidelines

In order to improve the clarity, quality and development time it is worth considering the following principles whenever possible:

-   [DRY (Don't Repeat Yourself)](https://en.wikipedia.org/wiki/Don't_repeat_yourself)
-   [KISS (Keep It Simple, Stupid)](https://en.wikipedia.org/wiki/KISS_principle)
-   [SoC (Separation of Concerns)](https://en.wikipedia.org/wiki/Separation_of_concerns)
-   [Single responsibility principle](https://en.wikipedia.org/wiki/Single_responsibility_principle)
-   [Law of Demeter](https://en.wikipedia.org/wiki/Law_of_Demeter)

---

## Style Guide

-   [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript/blob/master/README.md) is being followed in our code base.

-   Code formatting is handled entirely by Prettier. Run `npm run prettify` from the root of the project to format all code. Code is also automatically formatted [pre-commit](https://www.atlassian.com/git/tutorials/git-hooks).

---

## JSX Rules

-   Use `localize('...')` or `<Localize i18n_default_text='...'` for translations.
-   Do NOT use `variables` to `localize()`, this will break the translations, for example:

```JavaScript
    // Do NOT use this
    localize(item.title)

    // Use this
    localize('title')
```

-   Use `website_name` constant instead of `Deriv`.
-   Do NOT use `<Element attributeName={true} />`; just use `<Element attributeName />`.
-   Always name your components before default exporting them, for example:

```JavaScript
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

-   There are cases where you do not want your strings to be escaped (i.g. when you place `<a/>` tags inside a `<Table />`). To bypass HTML escape, you can use the `interpolation.escapeValue` boolean property of the localize `options` param (under normal circumstances do NOT use this.):

```JavaScript
localize('{{opening_tag}}Deriv App{{closing_tag}}', {
    opening_tag  : '<a href="https://app.deriv.com" rel="noopener noreferrer" target="_blank" class="link">',
    closing_tag  : '</a>',
    interpolation: { escapeValue: false },
}),
```
