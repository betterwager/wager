import React from 'react';
import Lottie from "react-lottie"
import * as dice from "../assets/14759-dice-rolling.json"


const defaultOptions1 = {
  loop: true,
  autoplay: true,
  animationData: dice.default,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};
const Loading = () => {
  return (
    <div style={{display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh"}}>
      <Lottie options={defaultOptions1} height={200} width={200} />
    </div>
  );
};
export default Loading;