# DTrader

This repository contains the static HTML, Javascript, CSS, and images content of the [DTrader](http://app.deriv.com/dtrader) website.

## Style Guide

-   [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript/blob/master/README.md) is partially being followed in our dtrader code base.

### Naming Conventions

<a id="naming-conventions-variables"></a>
**[Variables:](#naming-conventions-variables)** Variables should be lowercase words separated by `_` (snake_case) .

```JavaScript
const field_name = '...';
```

<a id="naming-conventions-constant-contents"></a>
**[Constant(Static) contents:](#naming-conventions-constant-contents)** Constant(Static) contents(numbers or strings) should be `UPPER_SNAKE_CASE`. UPPER CASE and separated by `_`.

```JavaScript
const MY_STATIC_CONTENT = '...';
```

<a id="naming-conventions-functions"></a>
**[Functions:](#naming-conventions-functions)** Functions should be camelCase. This is to easily distinguish between variables and functions.

```JavaScript
const myFunction = () => { ... };
```

<a id="naming-conventions-modules"></a>
**[Modules:](#naming-conventions-modules)** Module names and classes should be PascalCase.

```JavaScript
const MyModule = (() => { ... })();
```

<a id="naming-conventions-javascript-elements"></a>
**[JavaScript elements:](#naming-conventions-javascript-elements)** JavaScript elements start with `el_` for a similar effect.

```JavaScript
const el_test = document.getElementById('test');
```

<a id="naming-conventions-boolean"></a>
**[Boolean:](#naming-conventions-boolean)** Those variables which store a boolean value, should start with `is_`, `has_`, ...

```JavaScript
const is_updated = true;
const has_crypto = false;
```
