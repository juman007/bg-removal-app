import React from "react";
import "./Loader.css";

const Loader = () => {
   return (
      /* From Uiverse.io by Sourcesketch */
      <div>
         <div className="container">
            <div className="dot dot-1" />
            <div className="dot dot-2" />
            <div className="dot dot-3" />
         </div>
         <svg version="1.1" xmlns="http://www.w3.org/2000/svg">
            <defs>
               <filter id="goo">
                  <feGaussianBlur
                     result="blur"
                     stdDeviation={10}
                     in="SourceGraphic"
                  />
                  <feColorMatrix
                     values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 21 -7"
                     mode="matrix"
                     in="blur"
                  />
               </filter>
            </defs>
         </svg>
      </div>
   );
};

export default Loader;
