import lottie from 'lottie-web';
import React, { useEffect, useRef } from 'react';

import { LogoFull } from 'assets/img/images';

const FullPageLoading = () => {
  const container = useRef(null);
  useEffect(() => {
    lottie.loadAnimation({
      container: container.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: require('./loading.json')
    });
  }, []);
  return (
    <div className="loading-container">
      <div className="logo__container">
        <img className="logo--sm" src={LogoFull} alt="Technorio Logo"></img>
      </div>
      <div className="full-loading" ref={container}></div>
    </div>
  );
};

export default FullPageLoading;
