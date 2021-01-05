/*
 *   Finds all references to `rem` CSS unit and replaces with CSS custom property `--hem`
 *   So that library consumers can set base font-size to comply to `:host` (style/view encapsulation) styles
 */

module.exports = function (source, map) {
    const rem_to_em = source.replace(/(-?\d+\.?\d*)rem\b/g, v => `calc(${v.split('rem')[0]} * var(--hem))`);
    return this.callback(null, rem_to_em, map);
};
