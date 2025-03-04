import { useEffect, useState } from "react";
import Avatar from "../components/Avatar";
import ListGroupItem from "../components/ListGroupItem";
import { useDispatch, useSelector } from "react-redux";
import { GetAllConversation } from "../redux/conversation/conversationSlice";
const ListGroup = ({id}) => {
  const [loading,setLoading]=useState(true)
  const dispatch=useDispatch()
  const listConversation=useSelector((state)=>state.conversation.listConversation || [])
  useEffect(()=>{
    const fectchData=async()=>{
      setLoading(true)
      await dispatch(GetAllConversation(id))
      setLoading(false)
    }
    fectchData()
  },[dispatch,id])
  return (
    <div className="flex-1 overflow-y-auto">
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : listConversation.length > 0 ? (
        listConversation.map((conversation) => (
          <ListGroupItem key={conversation.conversationId} {...conversation} />
        ))
      ) : (
        <p className="text-center">Không có cuộc trò chuyện nào.</p>
      )}
    </div>
  );
};
export default ListGroup;
