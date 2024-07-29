import {useEffect} from 'react';
import {useSignal} from '@preact/signals-react';

function BackToTop() {
  const backToTopVisible = useSignal(false); // Signal boolean to control the visibility of the backToTop button

  // Effect to handle scroll event and determine button visibility
  useEffect(() => {
    // Function to handle scroll event
    const handleScroll = () => {
      const position = document.body.scrollTop; // Current position of scroll
      backToTopVisible.value = position > 300; // Set boolean signal on scroll position past 300px
    };

    // Attach scroll event listener to the document body *might not work for certain browsers*
    document.body.addEventListener('scroll', handleScroll);

    // Cleanup function to remove event listener
    return () => {
      document.body.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Function to scroll page back to top
  const scrollUp = () => {
    document.body.scrollTo({
      top: 0, // Scroll to top of page
      behavior: 'smooth', // Smooth scrolling *auto for instant scroll*
    });
  };

  return (
    <div className="Test">
      {backToTopVisible.value && (
        <button
          onClick={scrollUp}
          className="fixed bottom-5 right-5 h-12 w-12 bg-black rounded-full flex items-center justify-center text-white shadow cursor-pointer"
          aria-label="Back to top"
        >
          <div // Styling for arrow up icon
            style={{
              width: 0,
              height: 0,
              borderLeft: '0.7rem solid transparent',
              borderRight: '0.7rem solid transparent',
              borderBottom: '1.4rem solid white',
            }}
          ></div>
        </button>
      )}
    </div>
  );
}

export default BackToTop;
