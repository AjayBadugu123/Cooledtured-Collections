import {SocialIcon} from 'react-social-icons';

export default function Social() {
  return (
    <div className="fixed bottom-12 left-0 mb-4 ml-4 z-3">
      <ul className="space-y-3">
        <li>
          <SocialIcon url="https://twitter.com/cooledtured" />
        </li>
        <li>
          <SocialIcon url="https://instagram.com/cooledture" />
        </li>
        <li>
          <SocialIcon url="https://www.youtube.com/@cooledtured" />
        </li>
        <li>
          <SocialIcon url="https://discord.com/invite/BZ37tUZd?utm_source=Discord%20Widget&utm_medium=Connect" />
        </li>
        <li>
          <SocialIcon url="https://tiktok.com/@cooledtured/" />
        </li>
        <li>
          <SocialIcon url="https://facebook.com/cooledtured" />
        </li>
      </ul>
    </div>
  );
}
