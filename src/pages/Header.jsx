import Avatar from "../components/Avatar"
import TimeRequest from "../components/TimeRequest"

const Header=({avatar,name})=>{
    return <div className="flex items-center justify-between p-4 bg-gray-200">
    <div className="flex items-center">
      <Avatar name={name} avatar={avatar} />
      <TimeRequest name={name} />
    </div>
    <div className="flex items-center space-x-4">
      <i className="fas fa-phone"></i>
      <i className="fas fa-video"></i>
      <i className="fas fa-search"></i>
      <i className="fas fa-ellipsis-v"></i>
    </div>
  </div>
}
export default Header