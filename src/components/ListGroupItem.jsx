import Avatar from "./Avatar"

const ListGroupItem=()=>{
    return <div className="p-2">
    <div className="flex items-center p-2 hover:bg-blue-700 rounded">
      <Avatar name={""} avatar={""} />
      <div className="ml-2">
        <div className="font-bold">Nguyễn Văn Đang</div>
        <div className="text-sm">Bạn: K</div>
      </div>
    </div>
  </div>
}
export default ListGroupItem