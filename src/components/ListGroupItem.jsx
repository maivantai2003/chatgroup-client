import Avatar from "./Avatar"

const ListGroupItem=({id,avatar,conversationName,content,userSend})=>{
    return <div className="p-2">
    <div className="flex items-center p-2 hover:bg-blue-700 rounded">
      <Avatar name={conversationName} avatar={avatar} />
      <div className="ml-2">
        <div className="font-bold">{conversationName}</div>
        <div className="text-sm">{userSend}: {content}</div>
      </div>
    </div>
  </div>
}
export default ListGroupItem