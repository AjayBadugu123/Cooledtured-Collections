import React, {useEffect} from 'react';
import {useSignal} from '@preact/signals-react';
import {FaTwitter, FaFacebookF, FaTwitch, FaMapMarkerAlt} from 'react-icons/fa';
import ContactForm from '~/components/ContactForm';

// Type definition for props of headers
type HeaderProps = {
  title: string;
  subtitle: string;
};

// Custom header for the about us page w/ customizable title and subtitle
const Header: React.FC<HeaderProps> = ({title, subtitle}) => {
  return (
    <div className="bg-gradient-to-b from-blue-900 to-blue-500 text-white p-12">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-2">{title}</h2>
        <h2 className="text-4xl font-bold">{subtitle}</h2>
      </div>
    </div>
  );
};

// Type definition for props of Tabs
type TabProps = {
  label: string;
  isActive: boolean;
  onClick: () => void;
};

// Selectable buttons for specific labels on the tabs for switching to its content
const Tab: React.FC<TabProps> = ({label, isActive, onClick}) => {
  const activeClasses = 'text-blue-600 border-b-2 border-blue-600'; // Selected tab
  const inactiveClasses = 'text-gray-500 hover:text-gray-700'; // Unselected tabs

  return (
    // Customized button depending on the label
    <button
      className={`py-2 font-semibold ${
        isActive ? activeClasses : inactiveClasses
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

// Type definition for props of the Content Template
type ContentTemplateProps = {
  title: string;
  content: string;
};

// Customized content for each label's content
const ContentTemplate: React.FC<ContentTemplateProps> = ({title, content}) => {
  return (
    <div className="container mx-auto py-12">
      <h2 className="text-center text-4xl font-bold text-blue-900 float-left mr-4">
        {title}
      </h2>
      <pre className="text-base md:text-sm font-sans">{content}</pre>
    </div>
  );
};

// Depending on the specific label tab, it will display its title and content
const Content = (label: string) => {
  switch (label) {
    case 'History':
      return (
        <div>
          <ContentTemplate
            title="HISTORY"
            content="Once upon a time in Burbank, California two otaku nerds who shared a love for anime, video games, and pop culture decided to open a store where they could share their passion with fellow fans. They created a haven for collectors, offering a wide range of limited and exclusive items from popular anime, gaming, and pop culture brands. With their excitement and dedication, they soon became a go-to destination for fans across America."
          />
        </div>
      );
    case 'Vision':
      return (
        <div>
          <ContentTemplate
            title="VISION"
            content="To be the ultimate destination for collectors and fans of anime, gaming, and pop culture, providing a vast selection of high-quality, limited and exclusive items. We aim to create an immersive and exciting shopping experience that celebrates the joy and passion of collecting, and inspires creativity and imagination. Through our products and services, we hope to build a thriving community of like-minded individuals who share our love for anime, gaming, and pop culture."
          />
        </div>
      );
    case 'Our Team':
      return (
        <div>
          <ContentTemplate
            title="OUR TEAM"
            content={`We're a team of passionate and dedicated collectors and enthusiasts of anime, gaming, and pop culture. We believe that collecting is not just a hobby, but a lifestyle, and we're excited to share our love and knowledge with fellow fans like you!

But that's not all - we've also got a team of skilled and friendly support staff who are always ready to assist you with your shopping needs. From finding that one figure you've been searching for to answering your questions about our products, our team is dedicated to providing you with the best customer service experience.
      
We're more than just a store - we're a community of collectors, gamers, and pop culture enthusiasts who share a passion for all things cool. Join us on this epic journey and let's have some fun!`}
          />
        </div>
      );
    case 'Our HQ':
      return (
        <div>
          <ContentTemplate
            title="OUR STORE"
            content="We are based in Los Angeles, California suburb of Burbank and Chicago, Illinois suburb of Bensenville. We distribute via USPS and UPS."
          />
        </div>
      );
    case 'Contact Us':
      return (
        <div>
          <ContentTemplate
            title="CONNECT"
            content="We cordially invite you into cooledtured.com, please feel free to browse our catalog. If you have any questions or just want to say hello, you can always email us directly at info@cooledtured.com and we will reply back to you as soon as we can."
          />
          <ContactForm />
        </div>
      );
    default:
      return null;
  }
};

// Helper function to format numbers over 1000 to have a "K" such as 1K = 1000
const formatNumber = (num: number) => {
  if (num >= 1000) {
    return Math.round(num / 1000) + 'K';
  } else {
    return num.toString();
  }
};

// Helper function to ease the animation to it's end of duration
const easeOutQuad = (t: number) => t * (2 - t);

// Counter function for the increase of numbers to its end number over a specific duration
const useCounter = (endNum: number, duration: number = 1) => {
  const count = useSignal(0); // Signal intial value for count of number climbing

  // UseEffect to start animation
  useEffect(() => {
    let frame = 0; // Intial value for current frame
    const totalFrames = duration * 60; // Total frames for the animation

    const counter = () => {
      frame++;
      // Calculate progress using an easing function
      const progress = easeOutQuad(frame / totalFrames);
      // Update count based on progress
      count.value = Math.floor(progress * endNum);

      if (frame < totalFrames) {
        requestAnimationFrame(counter);
      } else {
        count.value = endNum; // Ensure the last frame sets the value exactly to endNum
      }
    };

    requestAnimationFrame(counter);

    // Clean up the animation frame
    return () => {
      frame = totalFrames; // This effectively stops the animaion
    };
  }, [endNum]);

  return count;
};

// Type definition for props of stats
type StatProp = {
  number: number;
  text: string;
  shouldAppendPlus?: boolean;
};

// Custom display of the stats for the company
const Stat: React.FC<StatProp> = ({number, text, shouldAppendPlus}) => {
  const count = useCounter(number, 1.75); // Animation with customizable duration of numbers increasing

  return (
    <div className="flex flex-col items-center px-2 mb-4 md:mb-0 md:px-4">
      <span className="text-xl md:text-3xl font-semibold text-blue-950">
        {formatNumber(count.value)}
        {/* Checks if the number should be "10+" once its past the number we set */}
        {shouldAppendPlus && count.value >= number && '+'}
      </span>
      <span className="text-xs md:text-base text-gray-600 text-center">
        {text}
      </span>
    </div>
  );
};

// Custom profile card for team members name, positions, and their socials
const ProfileCard: React.FC<{username: string; position: string}> = ({
  username,
  position,
}) => {
  return (
    <div className="flex flex-col items-center p-4 w-full">
      {/* Image placeholder - blue card */}
      <div className="w-full h-32 bg-blue-900 rounded-2xl mb-4"></div>
      {/* Name of members and their position */}
      <div className="text-center">
        <div className="font-bold text-xl">{username}</div>
        <div className="text-sm">{position}</div>
        {/* Socials display*/}
        <div className="flex justify-center space-x-2 mt-2">
          <FaFacebookF className="text-blue-600 text-xl cursor-pointer" />
          <FaTwitter className="text-sky-400 text-xl cursor-pointer" />
          <FaTwitch className="text-purple-600 text-xl cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

// Custom location card for HQ's information
const LocationCard: React.FC<{location: string; position: string}> = ({
  location,
  position,
}) => {
  return (
    <div className="flex flex-col items-center p-4 w-full">
      {/* Image placeholder - blue card */}
      <div className="w-full h-32 bg-blue-900 rounded-2xl mb-4"></div>
      {/* Name of location and their position */}
      <div className="text-center">
        <div className="font-bold text-xl">{location}</div>
        <div className="text-sm">{position}</div>
        {/* Marker to take them to the location */}
        <div className="flex justify-center space-x-2 mt-2">
          <FaMapMarkerAlt className="text-red-600 text-xl cursor-pointer" />
        </div>
      </div>
    </div>
  );
};
export default function About() {
  const activeTab = useSignal('History'); // Signal value for the initial tab
  const Tabs = ['History', 'Vision', 'Our Team', 'Our HQ', 'Contact Us']; // Array of tabs to navigate
  const stats = [
    {number: 15000, text: 'Happy Customers'},
    {number: 150, text: 'Monthly Visitors'},
    {number: 15, text: 'Countries Worldwide'},
    {number: 10, text: 'Top Collaborations', shouldAppendPlus: true},
  ]; // Stat values for specific company accomplishments
  const locations = [
    {
      location: 'Los Angeles, California',
      position: 'Suburbs of Burbank',
    },
    {
      location: 'Illinois, Chicago',
      position: 'Suburbs of Bensenville',
    },
  ]; // Array of locations of HQ's
  const teamMembers = [
    // Add team members here
    {
      username: 'JohnDoe',
      position: 'CEO',
      // imageUrl: 'path_to_image',
      twitterUrl: 'twitter_link',
      facebookUrl: 'facebook_link',
      linkedinUrl: 'linkedin_link',
    },
    {
      username: 'DoeJohn',
      position: 'CEO',
      // imageUrl: 'path_to_image',
      twitterUrl: 'twitter_link',
      facebookUrl: 'facebook_link',
      linkedinUrl: 'linkedin_link',
    },
    {
      username: 'DoeJohn',
      position: 'CEO',
      // imageUrl: 'path_to_image',
      twitterUrl: 'twitter_link',
      facebookUrl: 'facebook_link',
      linkedinUrl: 'linkedin_link',
    },
    {
      username: 'DoeJohn',
      position: 'CEO',
      // imageUrl: 'path_to_image',
      twitterUrl: 'twitter_link',
      facebookUrl: 'facebook_link',
      linkedinUrl: 'linkedin_link',
    },
    {
      username: 'DoeJohn',
      position: 'CEO',
      // imageUrl: 'path_to_image',
      twitterUrl: 'twitter_link',
      facebookUrl: 'facebook_link',
      linkedinUrl: 'linkedin_link',
    },
    {
      username: 'DoeJohn',
      position: 'CEO',
      // imageUrl: 'path_to_image',
      twitterUrl: 'twitter_link',
      facebookUrl: 'facebook_link',
      linkedinUrl: 'linkedin_link',
    },
  ]; // Array of team member information

  return (
    <div>
      {/* Header Tab */}
      <Header title="About" subtitle="COOLEDTURED" />

      {/* Tabs and Content Tab */}
      <div className="mx-auto sm:w-9/12 md:w-8/12 lg:w-1/2">
        {/* Tab */}
        <div className="grid grid-flow-col gap-5">
          {Tabs.map((label) => (
            <Tab
              key={label}
              label={label}
              isActive={activeTab.value === label}
              onClick={() => (activeTab.value = label)}
            />
          ))}
        </div>
        {/* Content */}
        <div className="w-full">{Content(activeTab.value)}</div>
      </div>

      {/* Stats Tab */}
      <div className="flex flex-wrap justify-center items-center py-8 px-4">
        {stats.map((stat, index) => (
          <Stat
            key={index}
            number={stat.number}
            text={stat.text}
            shouldAppendPlus={stat.shouldAppendPlus}
          />
        ))}
      </div>

      {/* Meet Our Team Tab */}
      <div className="text-center pt-12 w-3/4 mx-auto">
        {/* Title */}
        <h2 className="text-4xl text-black-900 font-bold mb-4">
          Meet Our Team
        </h2>
        {/* Message about our team */}
        <p className="text-gray-400 text-xs mx-auto w-9/12">
          We're a team of passionate and dedicated collectors and enthusiasts of
          anime, gaming, and pop culture. We believe that collecting is not just
          a hobby, but a lifestyle, and we're excited to share our love and
          knowledge with fellow fans like you!
        </p>
      </div>
      {/* Profiles of team members */}
      <div className="w-1/2 mx-auto pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 p-4 justify-items-center mx-auto">
          {teamMembers.map((member, index) => (
            <ProfileCard
              key={index}
              username={member.username}
              position={member.position}
            />
          ))}
        </div>
      </div>

      {/* HQ Tab */}
      <div className="text-center pt-10 w-3/4 mx-auto">
        <h2 className="text-4xl text-black-900 font-bold mb-4">Our HQs</h2>
        <p className="text-gray-400 text-xs mx-auto w-9/12">
          We distribute via USPS and UPS
        </p>
      </div>

      {/* Profile of locations */}
      <div className="w-2/3 mx-auto pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-4 justify-items-center mx-auto">
          {locations.map((location, index) => (
            <LocationCard
              key={index}
              location={location.location}
              position={location.position}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
