# Writing and running tests on _Deriv app_

This document is intended to be a guideline for writing and running tests on _Deriv app_.

It will cover:

-   Brief explanation on the test framework used in the project.(**Jest**)

-   `react-testing-library` configuration.

-   Examples

    ## Test Framework

    ​ We are using [Jest](https://jestjs.io/)  as test runner and [React Testing library](https://testing-library.com/docs/react-testing-library/intro/) as our main test component to have the ultimate needed utilities.

    ### Jest

    ​ With Jest, we can run our tests quickly and even in parallel.

    ​ All of needed configurations are located in root folder of the project.

    #### Run Tests

    ​ To start the test suite, from the root directory, simply run:

    ​ `npm run test:jest`

    ​ Be informed that this command will run all tests in the whole project based on following configuration provided.

    ​ Also, the mentioned command will generate a coverage directory in the root directory, you can check the current coverage percentage from the generated html.

    #### Jest configuration

    ​

    -   `jest.config.js`

        General configuration of the jest which will use to run the tests from root directory of _Deriv app_

        -   `collectCoverage`: This flag makes jest to collect coverage report.
        -   `collectCoverageFrom`: To indicate which files the coverage report should collect from. Generally we exclude all of `node_modules` directories.
        -   `collectCoverageFrom`: The type of needed coverage report.
        -   `clearMocks`: configuration option to clear mocks automatically before each test.
        -   `projects`: To indicate that which components/directories should test.
        -   `transform`: A map from regular expressions to paths to transformers. A transformer is a module that provides a synchronous function for transforming source files.
        -   `testRegex`: The pattern or patterns Jest uses to detect test files.
        -   `transformIgnorePatterns`: An array of regexp pattern strings that are matched against all source file paths before transformation. If the file path matches **any** of the patterns, it will not be transformed.

    -   `jest.config.base.js`

        This Configuration file is held in common across all individual packages. In other words if you want to just run tests related to one package (e.g. trader) this is what that particular package will use as base configuration.

        Also, each component has a `jest.config.js` which extends the `jest.config.base.js`

#### Run tests from a specific package

With the base configuration extended in all packages, we have another option to run tests from a specific package inside the app. For instance, we can run test just from `trader` package:

##### Prerequisite

​install `jest` globally using the following command:

​`npm install jest@[CURRENT_VERSION_OF_JEST_IN_THE_ROOT_PACKAGE.JSON] -g`

##### Run the tests

Navigate to the root directory of the package on the command line, then simply run one of the following commands:

`jest` or `npx jest`

-   Please be informed with `collectCoverage` provided in the `jest.config.base.js` this command will generate coverage percentage in the directory that you are running the tests.

#### `setupTests.js`

This configuration file helps to add some extra assets and tools to the jest framework in order to have better accessibility and tools for the test runner(`jest`).
All of needed description are commented within the file itself.

### React Testing library

​ Regarding setup of `jest` in the root directory of _Deriv app_ you will see that we have access to all api's of `react-testing-library` in the

​ global. So you can just start to write tests without import `expect`, `it` or `describe` and lots of others as well (check [react-testing-library/jest-dom](https://www.npmjs.com/package/@testing-library/jest-dom) official document for more info).

​ In the _Deriv app_ all of needed packages and configuration are in the root directory, So no need to worry about configuration in all packages.

Some of added packages to root package.json are:

1. ```
   "@testing-library/react":
   ```

2. ```
   @testing-library/jest-dom
   ```

​

Here we have a simple component test that written using `react-testing-library ` :

```
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import RangeSlider from '../range-slider';

describe('RangeSlider', () => {
    it('should show  1 Tick if the value is 1', () => {
        const value = 1;
        const wrapper = render(<RangeSlider value={value} />);
        expect(wrapper.getAllByText('1 Tick')).toHaveLength(1);
    });

    it('should show 2 Ticks if the value is 2', () => {
        const value = 2;
        const wrapper = render(<RangeSlider value={value} />);
        expect(wrapper.getAllByText('2 Ticks')).toHaveLength(1);
    });

    it('should change the input with onchange target value', () => {
        const ChangeMock = jest.fn();
        const wrapper = render(<RangeSlider onChange={ChangeMock} />);
        const input = wrapper.getByLabelText('range-input');
        fireEvent.change(input, { target: { value: 5 } });
        expect(input.value).toBe('5');
    });
});
```
