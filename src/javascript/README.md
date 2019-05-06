JavaScript Guidelines
=============

### General Guidelines
In order to improve the clarity, quality and development time it is worth considering the following principles whenever possible:
- [DRY (Don't Repeat Yourself)](https://en.wikipedia.org/wiki/Don't_repeat_yourself)
- [KISS (Keep It Simple, Stupid)](https://en.wikipedia.org/wiki/KISS_principle)
- [SoC (Separation of Concerns)](https://en.wikipedia.org/wiki/Separation_of_concerns)
- [Single responsibility principle](https://en.wikipedia.org/wiki/Single_responsibility_principle)
- [Law of Demeter](https://en.wikipedia.org/wiki/Law_of_Demeter)

---

### Style Guide

- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript/blob/master/README.md) is partially being followed in our code base.

- Most styling issues will be caught by ESLint, so before pushing your changes remember to run `grunt eslint` to catch and fix any issues that it finds.

- Check below for the rules that are not caught by ESLint but should be followed.

### Naming Conventions

<a id="naming-conventions-variables"></a>
**[Variables:](#naming-conventions-variables)** Variables should be lowercase words separated by `_`.
    
```js
const field_name = '...';
```

<a id="naming-conventions-functions"></a>
**[Functions:](#naming-conventions-functions)** Functions should be camelCase. This is to easily distinguish between variables and functions.
    
```js
const myFunction = () => { ... };
```

<a id="naming-conventions-modules"></a>
**[Modules:](#naming-conventions-modules)** Module names and classes should be PascalCase.
    
```js
const MyModule = (() => { ... })();
```

<a id="naming-conventions-jquery-variables"></a>
**[jQuery variables:](#naming-conventions-jquery-variables)** jQuery variables should have a `$` in the beginning to mark them.
    
```js
const $test = $('#test');
```

<a id="naming-conventions-javascript-elements"></a>
**[JavaScript elements:](#naming-conventions-javascript-elements)** JavaScript elements start with `el_` for a similar effect.
    
```js
const el_test = document.getElementById('test');
``` 

<a id="naming-conventions-boolean"></a>
**[Boolean:](#naming-conventions-boolean)** Those variables which store a boolean value, should start with `is_`, `has_`, ...

```js
const is_updated = true;
const has_crypto = false;
```

<a id="naming-conventions-form-elements"></a>
**[Form elements:](#naming-conventions-form-elements)** Consider prefixes for form elements to make it more obvious what type of field they are, such as:

```js
const fields = {
    txt_name  : { id: '#txt_name' },
    chk_tnc   : { id: '#chk_tnc' },
    ddl_agents: { id: '#ddl_agents' },
};
```

---

### Commenting

<a id="commenting-explanations"></a>
**[Explanations:](#commenting-explanations)** Feel free to add comments to explain any code that is confusing.

<a id="commenting-todo"></a>
**[To do:](#commenting-todo)** Use `TODO: ...` comments anywhere that needs consideration or attention in the future.

<a id="commenting-api-requests"></a>
**[API requests:](#commenting-api-requests)** Comments should be added to highlight logic that is hardcoded in the front-end and should move to API:

- For changes that can be done in API V3, use the comment 
    
    ```js
    // API_V3: [description of what needs to be moved to API]
    ```

- For changes that should be done in API V4, use the comment 

    ```js
    // API_V4: [description of what needs to be moved to API]
    ```

---

### Import Rules

<a id="import-rules-require"></a>
**[Require:](#import-rules-require)** Use `require` instead of `import` to stay consistent with the current codebase. We could change it to `import` when switching to React.

<a id="import-rules-align-by-equal"></a>
**[Align by equal:](#import-rules-align-by-equal)** Assignments are generally aligned by `=` for readability purposes.

```js
const moment             = require('moment');                       // moment is an npm package
const CookieStorage      = require('./storage').CookieStorage;      // our own function
const applyToAllElements = require('./utility').applyToAllElements; // our own function
const createElement      = require('./utility').createElement;      // our own function
require('../../_common/lib/polyfills/array.includes');              // polyfill from lib folder
require('../../_common/lib/polyfills/string.includes');             // polyfill from lib folder
```

<a id="import-rules-alphabetical-ordering"></a>
**[Alphabetical ordering:](#import-rules-alphabetical-ordering)** The order is important; it should be sorted alphabetically according to path: 
    
- `moment` comes first as it's not a relative path.
- `s` is before `u` so `./storage` comes before `./utility`.
- Both `applyToAllElements` and `createElement` are from the same file, but `a` is before `c`
- Unassigned `require` goes to the end 

<a id="import-rules-combining-require"></a>
**[Combining require:](#import-rules-combining-require)** When there are many functions being imported from the same file, consider combining it into one import line.

```js
const Utility = require('./utility');

...

Utility.handleHash();
Utility.createElement('div');
...
```
