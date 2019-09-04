/**
 * Icon template file
 * Modifies react svg components
 */
function template(
    { template },
    opts,
    { imports, componentName, props, jsx, exports }
  ) {
    return template.ast`
      ${imports}
      import IconBase from './icon-base.jsx';

      const ${componentName} = (${props}) => {
      
          const Icon = IconBase(${jsx});
          props = { ...props };

          return Icon;
      
      };

      export default ${componentName};
    `
}

module.exports = template;
