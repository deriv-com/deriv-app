import React          from 'react';
import ReactDOMServer from "react-dom/server";
import { DBot }       from '@deriv/bot-skeleton';

export const scratch = () => {
  console.log(DBot);
  
  const scratch_div = document.getElementById(scratch_div);
  scratch_div.style.backgroundColor= '#889900';

  DBot.initWorkspace(__webpack_public_path__, this.dbot_store, this.api_helpers_store);
console.log('hey');
}



// export const scratchHtml = ReactDOMServer.renderToString(<div> hello world</div>);
