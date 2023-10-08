import { ImStatsBars } from "react-icons/im"
import { useContext } from "react"
import { authContext } from "@/lib/store/auth-context"

function Nav() {

  const { user, loading, logout } = useContext(authContext)

  return (
    <header className="container max-w-2xl px-8 py-6 mx-auto">
      <div className="flex items-center justify-between">
        {user && !loading && (
          <div className="flex items-center gap-2">
            <div className="h-[40px] w-[40px] rounded-full overflow-hidden">
              <img className="object-cover w-full h-full" src={user.photoURL} alt={user.displayName} referrerPolicy="no-referrer" />
            </div>
            <small>Hi {user.displayName}</small>
          </div>)
        }
        {user && !loading && (
          <nav className="flex items-center gap-2">
            <div>
              <ImStatsBars></ImStatsBars>
            </div>
            <div>
              <button className="text-xs bg-red-600 p-1 rounded-md transition-all duration-100 hover:scale-110" onClick={logout}>Sign Out</button>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}

export default Nav