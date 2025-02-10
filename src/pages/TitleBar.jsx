const TitleBar=({name})=>{
    return <div className="flex items-center p-4">
    <img
      alt="User avatar"
      className="rounded-full"
      height="40"
      src="https://storage.googleapis.com/a1aa/image/hpZhmsnlmmhMuDK-hctvwQqwNT_PXKlCqSxqX3YEwmo.jpg"
      width="40"
    />
    <span className="ml-2">{name}</span>
  </div>
}
export default TitleBar;