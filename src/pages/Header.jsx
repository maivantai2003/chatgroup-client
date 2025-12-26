import Avatar from "../components/Avatar";
import TimeRequest from "../components/TimeRequest";

const Header = ({ avatar, name, type, id, onStartCall,onToggleInfor }) => {
  console.log(type)
  return (
    <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
      <div className="flex items-center">
        <Avatar name={name} avatar={avatar} />
        <TimeRequest name={name} type={type} id={id} />
      </div>
      <div className="flex items-center space-x-4">
        {
          type==="user" && ( <i
          className="fas fa-video cursor-pointer"
          onClick={onStartCall}
        ></i>)
        }
        <i className="fas fa-search"></i>
        <i
          className="fas fa-info-circle cursor-pointer text-gray-600 hover:text-black"
          onClick={onToggleInfor}
        />
      </div>
    </div>
  );
};
export default Header;