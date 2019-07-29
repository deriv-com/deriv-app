# `deriv-base-style`
> Responsible for the basic style setup for all packages.

Includes:
* Colors - all color variables
* Devices - media query breakpoints
* Fonts - font variables and setup
* Reset

## Usage

```js
@import 'deriv-base-style/style'
```

### Examples

#### Devices:
```scss
    .some-class {
        @include respond(mobile) {
            max-width: 500px;
        }

        @include respond(laptop) {
            max-width: 1200px;
        }
    }
```

#### Fonts
The `@typeface($var, $text-transform)` mixin can be used to style any text element. Simply pass in a typeface `$var` name to the mixin.
The `$var` name is in the format `--$FONT_SIZE-$TEXT_ALIGN-$FONT_WEIGHT-$COLOR`.

Refer to `fonts.scss` for a list of valid font-sizes, text-align, font-weights & colors.

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

To define new typefaces, add the name and value in the `$FONT_SIZES`, `$FONT_WEIGHTS` or `$COLORS` maps accordingly in `fonts.scss` file.
