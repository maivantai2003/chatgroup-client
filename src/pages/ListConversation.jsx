import { useContext, useEffect, useState } from "react";
import Avatar from "../components/Avatar";
import { useDispatch, useSelector } from "react-redux";
import {
  addConversatioInState,
  GetAllConversation,
  updateConversationGroupInState,
  updateConversationInState,
} from "../redux/conversation/conversationSlice";
import { SignalRContext } from "../context/SignalRContext";
import { distance } from "framer-motion";
import ListConversationItem from "../components/ListConversationItem";
const ListConversation = ({ id, onSelectConversation,search }) => {
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const dispatch = useDispatch();
  const connection = useContext(SignalRContext);
  const listConversation = useSelector(
    (state) => state.conversation.listConversation || []
  );
  useEffect(() => {
    const fectchData = async () => {
      setLoading(true);
      await dispatch(GetAllConversation(id));
      setLoading(false);
    };
    fectchData();
  }, [dispatch, id]);
  useEffect(() => {
    console.log("Conection ... ... ...");
    if (connection) {
      connection.on("MemberToGroup", async () => {
        setLoading(true);
        await dispatch(GetAllConversation(id));
        setLoading(false);
      });
      connection.on("UpdateConversationUser", (conversation) => {
        
        dispatch(updateConversationInState(conversation));
      });
      connection.on("UpdateConversationGroup", (conversation) => {
        
        dispatch(updateConversationGroupInState(conversation));
      });
      connection.on("UpdateConversationCloud",(conversation)=>{
        
        dispatch(updateConversationInState(conversation))
      })
      connection.on("ReceiveAcceptFriend",(conversation)=>{
        
        dispatch(addConversatioInState(conversation))
      })
      connection.on("ReceiveConversationMemberGroup",(conversation)=>{
        
        dispatch(addConversatioInState(conversation))
      })
      connection.on("ReceiveConversationMemberInGroup",(conversation)=>{
        
        dispatch(updateConversationInState(conversation))
      })
      return () => {
        connection.off("MemberToGroup");
        connection.off("ReceiveAcceptFriend");
        connection.off("UpdateConversationUser");
        connection.off("UpdateConversationGroup");
        connection.off("UpdateConversationCloud")
        connection.off("ReceiveConversationMemberGroup")
        connection.off("ReceiveConversationMemberInGroup")
      };
    }
  }, [connection, id, dispatch]);
  const filteredConversations = listConversation.filter(
    (conv) => conv.userId === id
  ).filter((conv) =>
    search ? conv.conversationName.toLowerCase().includes(search.toLowerCase()) : true
  );;
  return (
    <div className="flex-1 overflow-y-auto">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : filteredConversations.length > 0 ? (
        filteredConversations.map((conversation) => (
          <ListConversationItem
            key={conversation.conversationId}
            {...conversation}
            isSelected={conversation.conversationId === selectedId}
            onClick={() => {
              setSelectedId(conversation.conversationId);
              onSelectConversation(conversation);
            }}
          />
        ))
      ) : (
        <p className="text-center">Không có cuộc trò chuyện nào.</p>
      )}
    </div>
  );
};
export default ListConversation;
