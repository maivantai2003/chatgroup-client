import Avatar from "../components/Avatar";
import ListGroupItem from "../components/ListGroupItem";
const ListGroup = () => {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-2">
        <div className="flex items-center p-2 bg-blue-700 rounded">
          <Avatar name={""} avatar={""} />
          <div className="ml-2">
            <div className="font-bold">Minh Quân</div>
            <div className="text-sm">
              Bạn:
              <a className="text-blue-300" href="#">
                https://github.com/microsoftarchive/redis/releases/tag/win-3.0.504
              </a>
            </div>
          </div>
        </div>
      </div>
      <ListGroupItem/>
      <div className="p-2">
        <div className="flex items-center p-2 hover:bg-blue-700 rounded">
          <Avatar name={""} avatar={""} />
          <div className="ml-2">
            <div className="font-bold">HH</div>
            <div className="text-sm">Bạn: Dr</div>
          </div>
        </div>
      </div>
      <div className="p-2">
        <div className="flex items-center p-2 hover:bg-blue-700 rounded">
          <div className="bg-purple-500 rounded-full w-10 h-10 flex items-center justify-center text-white">
            N
          </div>
          <div className="ml-2">
            <div className="font-bold">Nhà</div>
            <div className="text-sm">
              Bạn:
              <i className="fas fa-video"></i>
              Cuộc gọi video đi
            </div>
          </div>
        </div>
      </div>
      <div className="p-2">
        <div className="flex items-center p-2 hover:bg-blue-700 rounded">
          <Avatar name={""} avatar={""} />
          <div className="ml-2">
            <div className="font-bold">Huỳnh Thiện</div>
            <div className="text-sm">Bạn: Nào gần giao hàng nhắn em chút</div>
          </div>
        </div>
      </div>
      <div className="p-2">
        <div className="flex items-center p-2 hover:bg-blue-700 rounded">
          <Avatar name={""} avatar={""} />
          <div className="ml-2">
            <div className="font-bold">Vĩ Khang</div>
            <div className="text-sm">
              Bạn:
              <a className="text-blue-300" href="#">
                https://www.facebook.com/s...
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="p-2">
        <div className="flex items-center p-2 hover:bg-blue-700 rounded">
          <Avatar name={""} avatar={""} />
          <div className="ml-2">
            <div className="font-bold">DCT1215-Động Hacker</div>
            <div className="text-sm">
              Thái An:
              <a className="text-blue-300" href="#">
                https://www.facebook.com/s...
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="p-2">
        <div className="flex items-center p-2 hover:bg-blue-700 rounded">
          <Avatar name={""} avatar={""} />
          <div className="ml-2">
            <div className="font-bold">505</div>
            <div className="text-sm">Vĩ Khang: Okok cảm ơn nha Đ</div>
          </div>
        </div>
      </div>
      <div className="p-2">
        <div className="flex items-center p-2 hover:bg-blue-700 rounded">
          <Avatar name={""} avatar={""} />
          <div className="ml-2">
            <div className="font-bold">Long Hồ</div>
            <div className="text-sm">Bạn: Sữa tươi sương sáo cafe</div>
          </div>
        </div>
      </div>
      <div className="p-2">
        <div className="flex items-center p-2 hover:bg-blue-700 rounded">
          <Avatar name={""} avatar={""} />
          <div className="ml-2">
            <div className="font-bold">Cloud của tôi</div>
            <div className="text-sm">Bạn:</div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ListGroup;
