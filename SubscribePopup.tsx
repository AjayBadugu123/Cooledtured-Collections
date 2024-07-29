import {useSignal} from '@preact/signals-react';
import {useEffect} from 'react';
import Modal from 'react-modal';
<meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>

const SubscribePopup: React.FC = () => {
  const email = useSignal('');
  const isOpen = useSignal(false);
  const message = useSignal(''); // Signal to store the response message

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      !sessionStorage.getItem('subscribedPopupShown')
    ) {
      isOpen.value = true;
      sessionStorage.setItem('subscribedPopupShown', 'true');
    }
  }, []);

  const handleSubscribe = async () => {
    try {
      const response = await fetch(
        `https://a.klaviyo.com/api/v2/lists/${encodeURIComponent(
          'Xr4j4X',
        )}/subscribe`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Api-Key': 'REDMX5',
          },
          body: JSON.stringify({profiles: [{email: email.value}]}),
        },
      );
      if (response.ok) {
        // Success response
        message.value = 'Thank you for subscribing!';
      } else {
        // Handle HTTP errors
        message.value = 'An error occurred. Please try again.';
      }
    } catch (error) {
      console.error('Error subscribing:', error);
      message.value = 'An error occurred. Please try again.';
    }
  };

  return (
    <Modal
      isOpen={isOpen.value}
      onRequestClose={() => (isOpen.value = false)}
      className="max-w-md mx-auto rounded-lg shadow-lg"
      overlayClassName="bg-black bg-opacity-50 fixed inset-0"
    >
      <div className="p-5">
        <h2 className="text-2xl mb-4">Subscribe to Our Newsletter</h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={email.value}
          onChange={(e) => (email.value = e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <button
          onClick={handleSubscribe}
          className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Subscribe
        </button>
        {message.value && <p className="text-center mt-4">{message.value}</p>}
      </div>
    </Modal>
  );
};

export default SubscribePopup;
