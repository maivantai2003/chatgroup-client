import { useEffect, useState } from "react";
import Avatar from "../components/Avatar";
import ListGroupItem from "../components/ListGroupItem";
import { useDispatch, useSelector } from "react-redux";
import { GetAllConversation } from "../redux/conversation/conversationSlice";
import { useSignalR } from "../context/SignalRContext";
const ListGroup = ({id, onSelectConversation}) => {
  const [loading,setLoading]=useState(true)
  const [selectedId, setSelectedId] = useState(null);
  const dispatch=useDispatch()
  const connection=useSignalR()
  const listConversation=useSelector((state)=>state.conversation.listConversation || [])
  useEffect(()=>{
    const fectchData=async()=>{
      setLoading(true)
      await dispatch(GetAllConversation(id))
      setLoading(false)
    }
    fectchData()
  },[dispatch,id])
  useEffect(() => {
    if (connection) {
      connection.on("ReceiveAcceptFriend", () => {
        console.log("New message received in conversation");
        dispatch(GetAllConversation(id));
      });
      connection.on("MemberToGroup", (value) => {
        console.log("New message received in conversation "+value);
        //dispatch(GetAllConversation(id));
      });
      return () => {
        connection.off("ReceiveAcceptFriend");
        connection.off("MemberToGroup")
      };
    }
  }, [connection, dispatch, id]);
  const filteredConversations = listConversation.filter((conv) => conv.userId === id)
  return (
    <div className="flex-1 overflow-y-auto">
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : filteredConversations.length > 0 ? (
        filteredConversations.map((conversation) => (
          <ListGroupItem key={conversation.conversationId} 
          {...conversation}
          isSelected={conversation.conversationId === selectedId}
          onClick={() => {
            console.log("Clicked conversation:", conversation);
            setSelectedId(conversation.conversationId);
            onSelectConversation(conversation)
          }}
           />
        ))
      ) : (
        <p className="text-center">Không có cuộc trò chuyện nào.</p>
      )}
    </div>
  );
};
export default ListGroup;
