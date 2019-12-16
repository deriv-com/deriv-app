Sass Guidelines
===============

### General Guidelines
In order to improve the clarity, quality and development time it is worth considering the following principles whenever possible:
- [Keep Sass Simple](https://www.sitepoint.com/keep-sass-simple/), which means [KISS (Keep It Simple, Stupid)](https://en.wikipedia.org/wiki/KISS_principle) may override [DRY (Don't Repeat Yourself)](https://en.wikipedia.org/wiki/Don't_repeat_yourself) in some cases
- [Single responsibility selectors](https://en.bem.info/methodology/css/#single-responsibility-principle)

---

### Style Guide

- [Airbnb CSS / Sass Styleguide](https://github.com/airbnb/css/blob/master/README.md) is partially being followed in our code base.

- [CSS with BEM](https://en.bem.info/methodology/css/) is partially being followed in our code base.

- Most styling issues will be caught by [stylelint](https://github.com/stylelint/stylelint/blob/master/README.md), so before pushing your changes remember to run `grunt stylelint` to catch and fix any issues that it finds.

- Check below for the rules that are not caught by styling but should be followed.

### Naming Conventions

<a id="naming-conventions-selectors"></a>
**[Selectors:](#naming-conventions-selectors)** Selectors should follow the [BEM Two Dashes style](https://en.bem.info/methodology/naming-convention/#two-dashes-style): `block-name__elem-name--mod-name--mod-val`.

```scss
.button {}
.button--disabled {}
```

Remember to follow the [Single responsibility principle](https://en.bem.info/methodology/css/#single-responsibility-principle).

<a id="naming-conventions-variables"></a>
**[Variables:](#naming-conventions-variables)** Sass variables should be in uppercase and have a meaningful prefix.

```scss
$COLOR_RED: #e31c4b;

// Light theme
$COLOR_LIGHT_BLACK_1: rgba(0, 0, 0, 0.8);

// Dark theme
$COLOR_DARK_BLUE_1: #0b0e18;
```

Keep all common variables in the [constants.scss](https://github.com/binary-com/deriv-app/blob/master/src/sass/app/_common/base/constants.scss) file.

---

### Units

<a id="units-flexibility"></a>
**[Flexibility:](#units-flexibility)** If flexibility is needed, for example for font-size, use units such as `rem`, `vh`, `vw`, `fr`, and only use `px` if it's supposed to be a fixed value.


### Element Sizing
Types of sizing elements and when to use it.

`px`
You will use px when your element size will stay the same across devices. meaning that you can't acquire responsiveness unless you change the px of the element

example of usage:

```scss
    .have-border {
        border: 1px solid var(--border-normal);
    }

    .your-separator {
        height: 1px;
        background: var(--text-active);
    }
```

`rem`
rem will always follow the root element font-size, initially `1rem == 16px -> font-size: 100%`. However, we change our root font-size to 62.5%
so `1rem == 10px -> font-size: 62.5%`. Therefore, to size an element, we can just divide by 10 from the original designed pixel `10px == 1rem`

* Why are we using rem then? isn't it the same as px?.
-> Because now we are in full control of responsiveness. in global style we can just once setup font-size for each breakpoints we want to use.
root will be 62.5% which is 10px, then for big desktop we want to increase it `1rem == 12px`. then font-size will be 75.5%. These setup will only done once in the root element. and we can just use rem everywhere with a thought in mind `1rem == 10px`.

example of usage:

```scss
    .your-button {
        padding: 1rem 1.6rem;
    }

    .your-card-box {
        margin: 2.4rem;
        padding: 1.6rem;
    }
```

---

### Typography
The `@typeface($var, $text-transform)` mixin can be used to style any text element. Simply pass in a typeface `$var` name to the mixin.
The `$var` name is in the format `--$FONT_SIZE-$TEXT_ALIGN-$FONT_WEIGHT-$COLOR`.

Refer to `typography.scss` for a list of valid font-sizes, text-align, font-weights & colors.

```scss
// Define bold red title, align to the left
h1 {
    @include typeface(--title-left-bold-red);
}
```
The optional second argumant in the `@typeface` mixin sets the `text-transform`.
```scss
// Define an uppercased paragraph with color orange and font-weight 300
p {
    @include typeface(--paragraph-center-light-orange, uppercase);
}
```

To define new typefaces, add the name and value in the `$FONT_SIZES`, `$FONT_WEIGHTS` or `$COLORS` maps accordingly in `typography.scss` file. 

---

### Theme

<a id="theme-mixin"></a>
**[Mixin:](#theme-mixin)** use mixins wherever possible to standardize the colours used in different themes and reduce repetition.

```scss
@mixin link {
    color: $COLOR_WHITE;

    &:hover, &:active {
        text-decoration: none;
    }
}

.sidebar {
    background: $COLOR_LIGHT_GRAY;

    a {
        @include link;
        display: block;
    }
}
```


---

### SVG

<a id="svg-template-versus-sass"></a>
**[Template versus Sass:](#svg-template-versus-sass)** Add `SVG`s as components if you need to add classes to modify them in different themes. Otherwise you may import them in Sass, or you may import the `SVG` directly to a `Component` from `src/images`:

```JavaScript
import SomeIconSvg from 'Assets/SvgComponents/folder_name/some_icon.svg';

<SomeIconSvg width='15px' height='15px' />
```

<a id="svg-theme"></a>
**[Theme:](#svg-theme)** Use declared classes such as `color1-fill` to handle colouring of SVGs between different themes instead of adding extra Sass for each new image. If the existing classes don't cover what you need, create more [here](https://github.com/binary-com/deriv-app/blob/master/src/sass/app/_common/inline_icons.scss#L1-L10).

---

### Commenting

<a id="commenting-explanations"></a>
**[Explanations:](#commenting-explanations)** Feel free to add comments to explain any styling that is confusing.

<a id="commenting-todo"></a>
**[To do:](#commenting-todo)** Use `TODO: ...` comments anywhere that needs consideration or attention in the future.
