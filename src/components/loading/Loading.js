import lottie from 'lottie-web';
import React, { useEffect, useRef } from 'react';

const Loading = () => {
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
      <span className="loading" ref={container}></span>
    </div>
  );
};

export default Loading;
