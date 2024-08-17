import { Routes,Route } from "react-router-dom"
import { Home } from "../Pages/Home"
import { SignIn } from "../Pages/SignIn"
import { Subject } from "../Pages/Subject"
import { PreHome } from "../Pages/PreHome"

export const AllRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="nwhm/home" element={<Home />} />
        <Route path="nwhm/home/:id" element={<Subject />} />
        <Route path="nwhm" element={<PreHome />} />
    </Routes>
  )
}
