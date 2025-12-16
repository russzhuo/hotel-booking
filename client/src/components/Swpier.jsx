import { useState, useRef } from "react";
import "./Swiper.css";

export default function Swiper({ slides }) {
  const [index, setIndex] = useState(0);
  const slidesRef = useRef();
  // const

  // img width?

  const handleNextBtn = () => {
    setIndex(index + 1);
    slidesRef.current.style.left = "600px";
    console.log("next");
    // nextBtnRef.current.style.left=(index) * - 480 +"px";
  };

  const handlePrevBtn = () => {
    setIndex(index - 1);
    slidesRef.current.style.left = "-600px";
    console.log("prev");

    // prevBtnRef.current.style.right=(index) * - 480 +"px";
  };

  return (
    <div>
      <div className="wrap">
        <div ref={slidesRef} className="slides">
          {slides.map((item, i) => (
            <img id={i} src={item} />
          ))}
        </div>

        <button
          disabled={index === 0}
          className="button-prev"
          onClick={() => handleNextBtn()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={4}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </button>

        <button
          disabled={index === slides.length - 1}
          className="button-next"
          onClick={() => handlePrevBtn()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={4}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
