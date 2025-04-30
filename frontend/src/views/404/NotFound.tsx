import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <>
        <p className="text-center text-4xl font-bold ">Page Not Found</p>
        <p className="mt-[2rem] text-center">
            You could go back to the {' '}
            <Link to={'/'} className="text-cyan-600">Projects</Link>
        </p>
    </>
  )
}
