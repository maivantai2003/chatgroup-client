// import Avatar from "../components/Avatar";
// import Header from "./Header";
// import SelectMethod from "./SelectMethod";

// const ChatMessage = ({conversation}) => {
//   console.log(conversation)
//   return (
//     <div className="flex-1 flex flex-col">
//       <Header avatar={conversation.avatar} name={conversation.conversationName} />
//       <div className="flex-1 p-4 overflow-y-auto">
//         <div className="flex items-start mb-4">
//           <Avatar name={conversation} avatar={""} />
//           <div className="ml-2">
//             <div className="bg-gray-200 p-4 rounded-lg">
//               <a
//                 className="text-blue-500"
//                 href="https://github.com/microsoftarchive/redis/releases/tag/win-3.0.504"
//               >
//                 https://github.com/microsoftarchive/redis/releases/tag/win-3.0.504
//               </a>
//               <div className="mt-2 p-4 bg-white rounded-lg shadow">
//                 <div className="flex items-center">
//                   <img
//                     alt="GitHub logo"
//                     className="w-10 h-10"
//                     height="40"
//                     src="https://storage.googleapis.com/a1aa/image/dmCNblldJad5zJDm9l_RhmPoYBxXUkY4mLt8U35WtPU.jpg"
//                     width="40"
//                   />
//                   <div className="ml-2">
//                     <div className="font-bold">New Release win-3.0.504</div>
//                     <div className="text-sm">3.0.504</div>
//                   </div>
//                 </div>
//                 <div className="mt-2 text-sm text-gray-600">
//                   This is a critical bug fix release for Redis on Windows 3.0.
//                   If you are running a previous version of 3.0 in a cluster
//                   configuration, you should upgrade to 3.0.504 urgently...
//                 </div>
//                 <div className="mt-2 flex items-center text-sm text-gray-600">
//                   <i className="fas fa-code-branch"></i>
//                   <span className="ml-1">1 Contributor</span>
//                 </div>
//                 <div className="mt-2 text-sm text-gray-600">
//                   Release 3.0.504 · microsoftarchive/redis
//                 </div>
//                 <a className="text-blue-500" href="https://github.com">
//                   github.com
//                 </a>
//                 <div className="mt-2 text-sm text-gray-600">13:01</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <SelectMethod />
//     </div>
//   );
// };
// export default ChatMessage;
import { useDispatch, useSelector } from "react-redux";
import Avatar from "../components/Avatar";
import Header from "./Header";
import SelectMethod from "./SelectMethod";
import { useEffect } from "react";
import { GetCloudMessagesById } from "../redux/cloudmessage/cloudmessageSlice";
import UserMessages from "../components/UserMessages";
import GroupMessages from "../components/GroupMessages";
import CloudMessages from "../components/CloudMessages";
//import MessageItem from "./MessageItem";

const ChatMessage = ({ conversation }) => {
  
  const renderMessages = () => {
    switch (conversation.type) {
      // case "user":
      //   return <UserMessages conversationId={conversation.conversationId} />;
      // case "group":
      //   return <GroupMessages conversationId={conversation.conversationId} />;
      case "cloud":
        return <CloudMessages {...conversation} />;
      default:
        return <p className="text-center bg-white text-gray-400 text-xs">Không có tin nhắn</p>;
    }
  };
  return (
    <div className="flex-1 flex flex-col h-full">
      <Header
        avatar={conversation.avatar!==null?conversation.avatar:"https://res.cloudinary.com/dktn4yfpi/image/upload/v1740899136/bv3ndtwp1sosxw9sdvzj.jpg"}
        name={conversation.conversationName}
      />
      <div className="flex-1 p-4 overflow-y-auto">{renderMessages()}</div>
      <div className="sticky bottom-0 w-full bg-white">
        <SelectMethod {...conversation} />
      </div>
    </div>
  );
};

export default ChatMessage;
