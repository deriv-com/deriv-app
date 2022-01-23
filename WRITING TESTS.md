# Writing and running tests on Deriv App

This document is intended to be a guideline for writing and running tests on deriv app.

Things that this document covers:

* Brief explanation on test framework implemented on the project.(Jest)

* We will describe how `react-testing-library` configured. 

* An example of how to write test on using implemented framework

   

  ## Test Framework explanation 

  ​	We are using `Jest` as test runner and [React Testing library](https://testing-library.com/docs/react-testing-library/intro/) as our main test component to have the ultimate needed utilities.

  

  ### 	Jest 

  ​		With Jest we can run our tests quickly and even parallel.

  ​		All of needed configurations are located in root folder of the app.

  

  #### 	Run Tests

  ​		To Run tests from root directory simply run:

  ​			```npm run test:jest```

  ​		Be informed that this command will run all of the tests in the whole app based on following configuration provided.

   

  #### 	Jest configuration files explanation

  ​	

  * `jest.config.js`

    General configuration of the jest which will use to run the tests from root directory of deriv-app 

    1. `collectCoverage`: with this flag jest will collect the coverage report in order to know how much and which files of the code has test coverage.
    2. `collectCoverageFrom`: To indicate which files should and should not test. Generally we exclude all of `node_modules` directories.
    3. `collectCoverageFrom`: The type of needed coverage report.
    4. `clearMocks`: configuration option to clear mocks automatically before each tests.   
    5. `projects`: To indicate that which components/directories should test.
    6. `transform`: A map from regular expressions to paths to transformers. A transformer is a module that provides a synchronous function for transforming source files.
    7. `testRegex`: The pattern or patterns Jest uses to detect test files.
    8. `transformIgnorePatterns`: An array of regexp pattern strings that are matched against all source file paths before transformation. If the file path matches **any** of the patterns, it will not be transformed.

  

  * `jest.config.base.js`

    This Configuration file is held in common across all of the individual packages. In other words if you want to just run tests related to one package (eg. trader) this is what that particular package will use as base configuration.

    Also in each component has a `jest.config.js` which extend the `jest.config.base.js` 

    In this case we have another option to run tests from a specific package inside the app:	

    ##### 	Prerequisite

    ​    	You should install `jest` globally using following command

    ​			``` npm install jest@[CURRENT_VERSION_OF_JEST_IN_THE_ROOT_PACKAGE.JSON] -g ```


#### Run tests from a specific package
 
   Navigate to the related directory of package on the command line, then simply run one of the following commands:
    `jest` or `npx jest`

  
* `setupTests.js`

    This configuration file helps to add some extra assets and tools to the jest framework in order to have better accessibility and tools for the test runner(`jest`).
    All of needed description are commented within the file it self. 
  
    

### 	React Testing library

​			Regarding to setup of `jest` in the root directory of deriv-app you will see that we have access to all of base api's of `react-testing-library` in the 

​			global. So you can just start to write tests without import `expect`, `it` or `describe` and lots of others as well (check [react-testing-library/jest-dom](https://www.npmjs.com/package/@testing-library/jest-dom) official document for more info).

​			In the deriv-app all of needed packages and configuration are in the root directory, So no need to worry about configuration in all of the packages. 

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
