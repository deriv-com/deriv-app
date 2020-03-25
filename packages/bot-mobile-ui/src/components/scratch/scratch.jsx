import React     from 'react';
import PropTypes from 'prop-types';
import { DBot }  from '@deriv/bot-skeleton';

class Scratch extends React.Component {
  componentDidMount() {
    this.props.onMount();
  }

  componentWillUnmount() {
    this.props.onUnmount();
  }

  componentDidMount() {
    DBot.initWorkspace(__webpack_public_path__, this.dbot_store, this.api_helpers_store);
  }

  render() {
    <div id="scratch_div"></div>;
  }
}

MainContent.propTypes = {
  onMount: PropTypes.func,
  onUnmount: PropTypes.func,
};

export default Scratch;
