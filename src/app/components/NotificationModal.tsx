import React from 'react';

interface MessageData {
  event: 'ITEM_OUT_OF_STOCK' | 'ITEM_QUANTITY_UPDATED';
  payload: {
    _id: string;
    product: {
      title: string;
    };
    quantity: number;
  };
}

interface NotificationModalProps {
  eventData: MessageData[];
  onAcknowledge: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  eventData,
  onAcknowledge,
}) => {
  const messages = eventData.map(({ event, payload }) => {
    if (event === 'ITEM_OUT_OF_STOCK') {
      return `The product "${payload.product.title}" is now out of stock and has been removed from your cart.`;
    } else if (event === 'ITEM_QUANTITY_UPDATED') {
      return `The quantity for "${payload.product.title}" has been reduced to ${payload.quantity}.`;
    }
    return 'Your cart has been updated.';
  });

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center">
      <div
        className="bg-black p-5 rounded-lg max-w-[400px]"
        style={{
          backgroundColor: 'black',
          padding: '20px',
          borderRadius: '5px',
          maxWidth: '400px',
        }}
      >
        {messages.map((message, index) => (
          <p key={index} className="mb-2">
            {message}
          </p>
        ))}
        <button
          onClick={onAcknowledge}
          className="px-3 py-1 bg-blue-500 text-white text-sm rounded focus:outline-none hover:bg-blue-600"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default NotificationModal;
