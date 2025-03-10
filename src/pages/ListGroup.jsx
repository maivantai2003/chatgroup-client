import { useContext, useEffect, useState } from "react";
import Avatar from "../components/Avatar";
import ListGroupItem from "../components/ListGroupItem";
import { useDispatch, useSelector } from "react-redux";
import { GetAllConversation } from "../redux/conversation/conversationSlice";
import {SignalRContext} from "../context/SignalRContext"
const ListGroup = ({id, onSelectConversation}) => {
  const [loading,setLoading]=useState(true)
  const [selectedId, setSelectedId] = useState(null);
  const dispatch=useDispatch()
  const connection=useContext(SignalRContext)
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
      connection.on("MemberToGroup", () => {
        console.log("ListGroup")
        setLoading(true)
        dispatch(GetAllConversation(id))
        setLoading(false)
      });
      connection.on("ReceiveAcceptFriend", () => {
        dispatch(GetAllConversation(id))
      });
      return () => {
        connection.off("MemberToGroup");
        connection.off("ReceiveAcceptFriend")
      };
    }
  }, [connection]);
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
