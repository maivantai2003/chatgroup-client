const Avatar=({name,avatar})=>{
    return <img
    alt="avatar"
    className="rounded-full object-cover"
    style={{ width: "40px", height: "40px" }}
    src={avatar?avatar:"https://storage.googleapis.com/a1aa/image/1_h3yE-FwqM1SOyyfFp4DgklXqVQNwQlU9xTDnH8dV0.jpg"}
  />
}
export default Avatar;