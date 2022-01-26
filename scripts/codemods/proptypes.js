/**
 * Copyright 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

module.exports = function (file, api, options) {
    const j = api.jscodeshift;
    const printOptions = options.printOptions || { quote: 'single' };
    const root = j(file.source);

    function findLastImport() {
        let target;

        // find last import
        root.find(j.ImportDeclaration).forEach(path => {
            target = path;
        });

        return target;
    }

    // React.PropTypes
    const isReactPropTypes = path => {
        if (path.type === 'AssignmentExpression') {
            return !!path.left?.object?.name && path.left?.property?.name === 'propTypes';
        }
        return false;
    };

    function addTsTypeToTheComponentParam(componentName, typeName) {
        // doesn't work with React.memo or React.forwardRef
        root.find(j.VariableDeclarator, {
            id: { name: componentName },
        }).forEach(path => {
            const typeRef = j.tsTypeReference(j.identifier(typeName));

            const init = path?.value?.init;
            if (init) {
                if (init.type === 'CallExpression') {
                    if (
                        ['memo', 'forwardRef'].includes(init.callee.property?.name) ||
                        ['observer'].includes(init.callee.name)
                    ) {
                        if (init.arguments[0]?.params?.length > 0) {
                            init.arguments[0].params[0].typeAnnotation = j.tsTypeAnnotation(typeRef);

                            // init.predicate is added to make sure it adds parantheses to an arrow fn with single param which has a type
                            init.predicate = false;
                        }
                    }
                } else if (init.params && init.params.length === 1) {
                    init.params[0].typeAnnotation = j.tsTypeAnnotation(typeRef);
                    init.predicate = false;
                }
            }
        });
    }

    // If any PropTypes references exist, add a 'prop-types' import (or require)
    function insertTsTypes(componentPropTypesMap) {
        let hasModifications = false;

        const targetToInsert = findLastImport(j, root);

        Object.keys(componentPropTypesMap).forEach(componentName => {
            const propsTypeName = `${componentName}Props`;
            const properties = componentPropTypesMap[componentName];

            const tsProperties = [];

            Object.keys(properties).forEach(key => {
                const tsType = properties[key];

                const propertySignature = j.tsPropertySignature(j.identifier(key), j.tsTypeAnnotation(tsType));
                tsProperties.push(propertySignature);
            });

            const propsType = j.tsTypeLiteral(tsProperties);

            const type = j.tsTypeAliasDeclaration(j.identifier(propsTypeName), propsType);

            j(targetToInsert).insertAfter(type);

            addTsTypeToTheComponentParam(componentName, propsTypeName);

            hasModifications = true;
        });

        return hasModifications;
    }

    function removePropTypesUsage() {
        root.find(j.ExpressionStatement)
            .filter(path => isReactPropTypes(path.value.expression))
            .forEach(path => {
                path.replace(null);
            });
    }

    // Remove 'prop-types' imports
    function removePropTypesImport() {
        root.find(j.ImportDeclaration)
            .filter(path => {
                return path.node.source?.value === 'prop-types';
            })
            .forEach(path => {
                path.replace(null);
            });
    }

    function getTsSingleType(path) {
        if (path?.object?.name === 'PropTypes') {
            switch (path.property.name) {
                case 'bool':
                    return j.tsBooleanKeyword();
                case 'string':
                    return j.tsStringKeyword();
                case 'number':
                    return j.tsNumberKeyword();
                case 'func': {
                    const functionType = j.tsFunctionType([]);
                    functionType.typeAnnotation = j.tsTypeAnnotation(j.tsVoidKeyword());
                    return functionType;
                }
                default:
                    return j.tsUnknownKeyword();
            }
        }
        return j.tsUnknownKeyword();
    }

    function filterRedundantMemberType(types) {
        const typesMap = {};

        return types.filter(type => {
            const isExists = typesMap[type.type];
            typesMap[type.type] = true;
            return !isExists;
        });
    }

    function getTypePath(value) {
        if (value.object?.type === 'Identifier') {
            return value;
        }

        if (value.object?.type === 'MemberExpression') {
            return getTypePath(value.object);
        }

        return value;
    }

    function getTSType(key, value) {
        // Skip isRequired and finds the path of the type
        const path = getTypePath(value);

        if (key === 'children') {
            return j.tsTypeReference(j.tsQualifiedName(j.identifier('React'), j.identifier('ReactNode')));
        }

        if (value.type === 'CallExpression') {
            if (['oneOf', 'oneOfType'].includes(value.callee?.property?.name)) {
                const unionTypes = [];
                j(value)
                    .find(j.MemberExpression)
                    .forEach(subpath => {
                        unionTypes.push(getTsSingleType(subpath.value));
                    });
                return j.tsUnionType(filterRedundantMemberType(unionTypes));
            }
        }

        return getTsSingleType(path);
    }

    // get all React.PropTypes instances with PropTypes
    function getPropTypesReferences() {
        const componentPropTypesMap = {};

        root.find(j.AssignmentExpression)
            .filter(path => isReactPropTypes(path.value))
            .forEach(path => {
                if (path.value.right.properties.length >= 0) {
                    const fnComponentName = path.value.left.object.name;

                    componentPropTypesMap[fnComponentName] = {};

                    path.value.right.properties.forEach(property => {
                        if (property.key) {
                            componentPropTypesMap[fnComponentName][property.key.name] = getTSType(
                                property.key.name,
                                property.value
                            );
                        }
                    });
                }
            });

        return componentPropTypesMap;
    }

    removePropTypesImport();
    const componentPropTypesMap = getPropTypesReferences();
    const hasModifications = insertTsTypes(componentPropTypesMap);

    removePropTypesUsage();

    return hasModifications ? root.toSource(printOptions) : null;
};
