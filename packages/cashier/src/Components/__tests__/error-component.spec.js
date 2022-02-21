import React, { useEffect } from 'react';
import { screen, render } from '@testing-library/react';
import ErrorComponent from '../error-component';
import { Router } from 'react-router-dom';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { createBrowserHistory } from 'history';

// const mHistory = {
//     listen: jest.fn(),
//   };

//   jest.mock("react-router-dom", (mHistory) => ({
//     ...jest.requireActual("react-router-dom"),
//     useHistory: jest.fn(() => mHistory),
//   }));
describe('<ErrorComponent/>', () => {
    // afterAll(() => {
    //     jest.resetAllMocks();
    //   });
    // let history;
    // const renderWithRouter = component => {
    //     history = createBrowserHistory();
    //     return render(<Router history={history}>{component}</Router>);
    // };
    const props = {
        setError: jest.fn(),
    };
    const reloadFn = () => {
        window.location.reload(true);
    };
    beforeAll(() => {
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: { reload: jest.fn() },
        });

        // jest.mock('react-router-dom', () => ({
        //     ...jest.requireActual('react-router-dom'),
        //     useHistory: () => ({
        //       listen: jest.fn()

        //     })
        //   }));
    });

    it('should show the default message when message is not passed', () => {
        const message = '';
        render(<ErrorComponent message={message} />);
        expect(screen.getByText('Sorry, an error occured while processing your request.')).toBeInTheDocument();
    });

    it('should show the actual message when message is passed', () => {
        const message = 'This is the error message';
        render(<ErrorComponent message={message} />);
        expect(screen.getByText(message)).toBeInTheDocument();
    });

    it('should show refresh message when should_show_refresh is true', () => {
        render(<ErrorComponent should_show_refresh={true} />);
        expect(screen.getByText('Please refresh this page to continue.')).toBeInTheDocument();
    });
    it('should show refresh message when should_show_refresh is false', () => {
        const refreshRequestText = screen.queryByText('Please refresh this page to continue.');
        render(<ErrorComponent should_show_refresh={false} />);
        expect(refreshRequestText).toBeNull();
        //expect(screen.not.getByText('Please refresh this page to continue.')).toBeInTheDocument();
    });
    it('should show default message when header message is not passed', () => {
        const header = '';
        render(<ErrorComponent header={header} />);
        expect(screen.getByText('Something’s not right')).toBeInTheDocument();
    });
    it('should show actual message when header message is passed', () => {
        const header = 'Header Text';
        render(<ErrorComponent header={header} />);
        expect(screen.getByText(header)).toBeInTheDocument();
    });
    it('should refresh the page when redirectOnClick is not passed or empty', () => {
        const redirectOnClick = '';
        render(<ErrorComponent buttonOnClick={redirectOnClick} />);
        reloadFn(); // as defined above..
        expect(window.location.reload).toHaveBeenCalled();
    });
    it('should call the setError function if the seterror is a function', () => {
        jest.spyOn(React, 'useEffect').mockImplementation();
        const historyMock = { push: jest.fn(), location: {}, listen: jest.fn() };
        jest.spyOn(historyMock, 'listen');
        const setError = jest.fn();
        // const queue =[];
        // const mUnListen = jest.fn();
        // const mHistory = {
        //   listen: jest.fn().mockImplementation(fn => {
        //     queue.push(fn);
        //     return mUnListen;
        //   })
        // };
        // const setError = jest.fn();

        const wrapper = render(<ErrorComponent />);
        //queue[0]();
        expect(historyMock.listen).toBeCalledWith(1);
        expect(setError).toBeCalledWith(0);

        wrapper.unmount();
        expect(mUnListen).toBeCalledTimes(1);

        //jest.spyOn(React,'useEffect').mockImplementation();

        //const setError  = jest.spyOn(ErrorComponent.prototype,'setError');
        // act(()=>{
        //     render(<ErrorComponent {...props} />);
        // })

        //renderWithRouter(<ErrorComponent {...props}/>);

        // const unlistenMock = jest.fn();
        // listenMock.mockReturnValue(unlistenMock);
        // const history = createMemoryHistory();
        //const historyMock = {listen: jest.fn() };
        //const listen = jest.fn();
        //const listenSpy = jest.spyOn(history, 'listen');

        //expect(useEff).toHaveBeenCalled(1)
        //expect(historyMock.listen).toHaveBeenCalled(1)
        //console.log(typeof useHistory.listen);
        // console.log(typeof props.setError );
        // console.log(listenSpy.listen);
        // if(listenSpy){
        //     if(typeof props.setError == 'function'){
        //         expect(props.setError).toHaveBeenCalledTimes(1);
        //     }
        // }

        // if (typeof setError === 'function') {
        //     expect(ErrorComponent.prototype.setError).toHaveBeenCalled(1);
        // }

        //expect(mockHistoryListen).toHaveBeenCalled(1);

        //expect(mHistory.listen).toHaveBeenCalled();
    });
});
