import { useState } from "react"

const SearchInput=()=>{
    const [search,setSearch]=useState("")
    return <div className="p-4">
    <input
      className="w-full p-2 rounded bg-white text-black"
      placeholder="Tìm kiếm"
      onChange={e=>{setSearch(e.target.value)
      }}
      value={search}
    />
  </div>
}
export default SearchInput