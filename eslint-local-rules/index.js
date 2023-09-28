module.exports = {
    /** This rule is used to prevent the use of `React` namespace. ex: `React.useEffect` -> `useEffect` */
    'no-react-namespace': {
        create(context) {
            return {
                MemberExpression(node) {
                    if (node.object.type === 'Identifier' && node.object.name === 'React') {
                        context.report({
                            node,
                            message: `Use ${node.property.name} instead of React.${node.property.name}.`,
                            fix: fixer => {
                                const start = node.object.range[0];
                                const end = node.object.range[1] + 1;
                                return fixer.removeRange([start, end]);
                            },
                        });
                    }
                },
            };
        },
    },
};
