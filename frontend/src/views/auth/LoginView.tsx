import { useForm } from "react-hook-form";
import { UserLoginForm } from "@/types/index";
import { useMutation } from "@tanstack/react-query";
import ErrorMessage from "@/components/ErrorMessage";
import { Link, useNavigate } from "react-router-dom";
import { authenticateUser } from "@/api/AuthAPI";
import { toast } from "react-toastify";

export default function LoginView() {

    const navigate = useNavigate()
    const initialValues: UserLoginForm = {
        email: '',
        password: '',
    }
    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues })

    const { mutate } = useMutation({
        mutationFn: authenticateUser,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: () => {
            navigate('/')
        }
    })

    const handleLogin = (formData: UserLoginForm) => mutate(formData)

    return (
        <>
            <h1 className="text-2xl text-gray-500 font-normal">Fill the form to log in</h1>
            <form
                onSubmit={handleSubmit(handleLogin)}
                className="space-y-8 mt-[4rem] shadow-lg rounded-xl p-10 bg-white"
                noValidate
            >
                <div className="flex flex-col">
                    <label
                        className="text-lg uppercase font-bold flex"
                    >Email</label>

                    <input
                        id="email"
                        type="email"
                        placeholder="Email"
                        className="w-full p-3  border-gray-300 border"
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /\S+@\S+\.\S+/,
                                message: "Invalid email",
                            },
                        })}
                    />
                    {errors.email && (
                        <ErrorMessage>{errors.email.message}</ErrorMessage>
                    )}
                </div>

                <div className="flex flex-col">
                    <label
                        className="text-lg uppercase font-bold flex"
                    >Password</label>

                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-3  border-gray-300 border"
                        {...register("password", {
                            required: "Password is required",
                        })}
                    />
                    {errors.password && (
                        <ErrorMessage>{errors.password.message}</ErrorMessage>
                    )}
                </div>

                <input
                    type="submit"
                    value='Log In'
                    className="bg-cyan-600 w-full text-center text-white rounded-lg shadow-lg py-[1rem] border-2 border-cyan-600 hover:bg-transparent hover:text-cyan-600 hover:border-cyan-600 transition-colors cursor-pointer duration-300"
                />
            </form>

            <div className="mt-[2rem] flex text-center flex-col space-y-[1rem]">
                <nav className="">
                    <Link to={'/auth/forgot-password'}>¿Forgot your password? Reset</Link>
                </nav>
                <nav className="">
                    <Link to={'/auth/register'}>¿No account yet? Sign Up</Link>
                </nav>
            </div>
        </>
    )
}