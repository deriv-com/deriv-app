import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

const App = () => (
    <strong>Hello World!</strong>
);

App.propTypes = {
    root_store: PropTypes.object,
};

export default App;

const wrapper = document.getElementById('app');
wrapper ? ReactDOM.render(<App />, wrapper) : false;
