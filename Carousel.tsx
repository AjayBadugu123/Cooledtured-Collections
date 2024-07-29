import {useSignal} from '@preact/signals-react';
import {FaArrowLeft, FaArrowRight} from 'react-icons/fa';
import slideData from '../data/slideData_fandom.json';
import {useEffect, useRef} from 'react';

// Slide Data - An array of objects, each representing a slide with its content.
// Each object contains an ID, subheading, heading, description, call-to-action (CTA) link and text, and an image URL.

function Carousel() {
  // State for managing slides and current slide index
  const slide = useSignal(slideData);
  const isClicked_P = useSignal(false);
  const isClicked_N = useSignal(false);
  const currentSlide = useSignal(0);
  const nextClicked = useSignal(false);

  // Background for each slide
  const slideBgImage = [
    `linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0)), url("/images/Featured_Fandoms/slideBgImgs/bgImg1.png")`,
    `linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0)), url("/images/Featured_Fandoms/slideBgImgs/bgImg2.png")`,
    `linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0)), url("images/Featured_Fandoms/slideBgImgs/bgImg3.png")`,
  ];

  // Text styles for subheading, heading, and description based on the index of the slide
  const textStyles = [
    {color: '#ffffff'},
    {color: '#FFFF00'},
    {color: '#4de2b8'},
  ];

  // Function to handle click on the "Previous" button
  // It decrements the currentSlide index or loops back to the last slide if the first slide is currently displayed.
  const prevSlide = () => {
    currentSlide.value =
      currentSlide.value === 0
        ? slide.value.length - 1
        : currentSlide.value - 1;
    nextClicked.value = false;
    isClicked_P.value = true;
    // Reset the animation
    setTimeout(() => (isClicked_P.value = false), 600); // Duration of the animation
  };

  // Function to handle click on the "Next" button
  // It increments the currentSlide index or loops back to the first slide if the last slide is currently displayed.
  const nextSlide = () => {
    currentSlide.value =
      currentSlide.value === slide.value.length - 1
        ? 0
        : currentSlide.value + 1;
    nextClicked.value = true;
    isClicked_N.value = true;
    // Reset the animation
    setTimeout(() => (isClicked_N.value = false), 600); // Duration of the animation
  };

  // Custom hook for setting up an interval
  function useInterval(callback: () => void, delay: number) {
    const intervalId = useRef<number | null>(null); // useRef to persist the interval ID across renders

    useEffect(() => {
      intervalId.current = setInterval(callback, delay); // Set up the interval
      return () => clearInterval(intervalId.current); // Clear interval on component unmount or dependencies change
    }, [callback, delay]); // Dependencies array for useEffect
  }

  // Using the custom useInterval hook
  useInterval(() => {
    const nextIndex = (currentSlide.value + 1) % slide.value.length; // Calculate next slide index
    setTimeout(() => {
      currentSlide.value = nextIndex; // Update slide index
    }, 250); // Transition delay
  }, 9000); // Interval delay

  // Rendering the main carousel section.
  return (
    <>
      <style>
        {`
          /* Styling for the slide container */
          .slide-container {
            position: relative;
            overflow: hidden;
            transition: transform 0.3s ease-in-out; /* Smooth transition for scaling */
          }

          /* Scale effect on hover */
          .slide-container:hover {
            transform: scale(1.01);
          }

          /* Glass shimmer effect */
          .slide-container::after {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0) 100%);
            transition: left 0.7s ease-in-out;
          }

          /* Shimmer effect when hovering */
          .slide-container:hover::after {
            left: 100%;
          }


        /* Indicator button styles */
        .indicator-buttons {
          position: absolute;
          bottom: 1rem;
          display: flex;
          align-items: flex-end;
        }

        .indicator-button {
          width: .75rem;
          height: .75rem;
          background-color: #ccc;
          border: 2px solid #fff; /* White border */
          border-radius: 50%;
          cursor: pointer;
          transition: background-color 0.3s ease-in-out, border-color 0.3s ease-in-out; /* Smooth transition for background color and border color */
        }

        /* Dark outline for active indicator button */
        .indicator-button.active {
          background-color: #666;
          border-color: #333; /* Dark outline */
        }

        /*button bounce effects*/
        @keyframes bounceEffect {
          0% { 
            transform: scale(1.25);
            background-color:rgb(31 41 55 / var(--tw-bg-opacity)) }
          50% { 
            transform: scale(0.8);
            background-color:rgb(10 10 10) }
          75% { transform: scale(1.1);
            background-color:rgb(20 20 20) }
          100% { transform: scale(1.25);
            background-color:rgb(31 41 55 / var(--tw-bg-opacity)) }
        }

        .bounce {
          animation: bounceEffect 200ms ease-in-out;

        }

        `}
      </style>

      {/* ------- Slide Container ------- */}
      <section
        className={`slide-container mx-auto flex h-96 max-w-5xl mt-4 mb-8 overflow-hidden bg-blue-700 ${
          nextClicked ? 'next-clicked' : ''
        }`}
        style={{
          backgroundImage: `${slideBgImage[currentSlide.value]}`,
          backgroundSize: 'cover', // Adjust the background size as needed
          backgroundPosition: 'center', // Adjust the background position as needed
        }}
      >
        {slide.value.map((slide, slideIndex) => {
          const {id, subheading, heading, description} = slide;
          return (
            // -------- Individual Slides -------
            <a
              /* ------- Call to Action ------- */
              href={slide.ctaLink}
              target="_blank"
              rel="noreferrer"
              className={`absolute hover:no-underline inset-0 flex flex-col md:flex-row top-0 md:w-full h-full max-w-5xl max-h-full justify-center items-center md:gap-y-12 md:ml-2 transition-opacity duration-300 ease-in-out ${
                slideIndex === currentSlide.value ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                transform: `translateX(${
                  100 * (slideIndex - currentSlide.value)
                }%)`,
              }}
              key={id}
            >
              {/* ------------- Subheading ------------ */}
              <div className="md:basis-3/4 md:ml-28 space-y-3">
                {' '}
                {/* Adjust spacing and layout */}
                <span
                  className="block uppercase mb-2 text-white text-lg font-bold leading-6 tracking-tight"
                  style={{color: textStyles[slideIndex].color}}
                >
                  {subheading}
                </span>
                {/* ------- Heading ------- */}
                <h3
                  className="block uppercase mb-2 text-white text-4xl font-bold leading-snug tracking-tighter"
                  style={{color: textStyles[slideIndex].color}}
                >
                  {heading}
                </h3>
                {/* ------- Description ------- */}
                <p
                  className="hidden md:text-left w-full mx-8 md:block md:ml-0 text-xl font-normal leading-normal tracking-tighter text-white"
                  style={{color: textStyles[slideIndex].color}}
                >
                  {description}
                </p>
              </div>

              {/* ------- Image ------- */}
              <img
                src={slide.image}
                alt={heading}
                className="hidden md:block w-auto relative max-w-full max-h-full pr-8 object-contain" // Ensure image fits within the grid cell
              />
            </a>
          );
        })}
        <div className="flex h-full justify-center items-center">
          {/* Previous button */}
          <button
            onClick={prevSlide}
            className={`hidden md:block transition-all duration-300 ease-in-out hover:scale-125 hover:bg-gray-600 hover:border-black hover:border-2 hover:py-28 hover:rounded-xl absolute left-4 z-2 p-2 text-white bg-gray-800 rounded-full ${
              isClicked_P.value ? 'bounce' : ''
            }`}
          >
            <FaArrowLeft />
          </button>

          {/*Next button */}
          <button
            onClick={nextSlide}
            className={`hidden md:block transition-all duration-300 ease-in-out hover:scale-125 hover:bg-gray-600 hover:border-black hover:border-2 hover:py-28 hover:rounded-xl  absolute right-4 z-2 p-2 text-white bg-gray-800 rounded-full ${
              isClicked_N.value ? 'bounce' : ''
            }`}
          >
            <FaArrowRight />
          </button>
        </div>

        {/* Indicator buttons */}
        <div className="indicator-buttons w-full justify-center">
          {slide.value.map((_, index) => (
            <div
              key={index}
              className="relative flex justify-center items-center content-center w-10 h-6"
            >
              <div
                key={index}
                className={`indicator-button absolute transition-all duration-300 ease-in-out hover:w-4 hover:h-4 ${
                  index === currentSlide.value ? 'active' : ''
                }`}
                onClick={() => (currentSlide.value = index)}
              />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default Carousel;
