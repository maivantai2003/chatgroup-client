const MessageItem = ({ message }) => {
    return (
      <div className="flex items-start mb-4">
        <Avatar name={message.senderName} avatar={message.avatar} />
        <div className="ml-2">
          <div className="bg-gray-200 p-4 rounded-lg">
            <p>{message.content}</p>
            {message.link && (
              <div className="mt-2 p-4 bg-white rounded-lg shadow">
                <div className="flex items-center">
                  <img
                    alt="Link preview"
                    className="w-10 h-10"
                    height="40"
                    src={message.previewImage}
                    width="40"
                  />
                  <div className="ml-2">
                    <div className="font-bold">{message.previewTitle}</div>
                    <div className="text-sm">{message.previewDescription}</div>
                  </div>
                </div>
                <a className="text-blue-500" href={message.link}>
                  {message.link}
                </a>
                <div className="mt-2 text-sm text-gray-600">{message.time}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  export default MessageItem;
  