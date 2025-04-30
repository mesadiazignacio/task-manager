import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

export default function AuthLayout() {
  return (
    <>
      <div className="bg-slate-100 min-h-screen flex flex-col">
        <div className="gap-[2rem] lg:py-[5rem] mx-auto text-center w-[30rem]">
          <p className="text-6xl">Task Manager</p>
          <div>
            <Outlet />
          </div>
        </div>
      </div>

      <ToastContainer
        pauseOnHover={false}
        pauseOnFocusLoss={false}
      />
    </>
  )
}
