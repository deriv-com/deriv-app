import React from 'react';
// Optimize loading with the following page-hiding snippet by temporarily hiding the page while the optimizer container loads
const GoogleOptimizer = () => (
    <React.Fragment>
        <style dangerouslySetInnerHTML={{ __html: '.async-hide { opacity: 0 }' }} />
        <script dangerouslySetInnerHTML={{ __html: '(function(a,s,y,n,c,h,i,d,e){s.className+=" "+y;h.start=1*new Date;h.end=i=function(){s.className=s.className.replace(RegExp(" ?"+y),"")};(a[n]=a[n]||[]).hide=h;setTimeout(function(){i();h.end=null},c);h.timeout=c;})(window,document.documentElement,"async-hide","dataLayer",4000,{"GTM-MZWFF7":true});' }} />
    </React.Fragment>
);
export default GoogleOptimizer;
