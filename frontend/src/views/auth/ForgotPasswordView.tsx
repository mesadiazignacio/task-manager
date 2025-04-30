import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { ForgotPasswordForm } from "../../types";
import ErrorMessage from "@/components/ErrorMessage";
import { forgotPassword } from "@/api/AuthAPI";
import { toast } from "react-toastify";

export default function ForgotPasswordView() {
    const initialValues: ForgotPasswordForm = {
        email: ''
    }
    const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: initialValues });

    const { mutate } = useMutation({
        mutationFn: forgotPassword,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            reset()
        }
    })

    const handleForgotPassword = (formData: ForgotPasswordForm) => mutate(formData)


    return (
        <>
            <h1 className="text-2xl text-gray-500 font-normal">Fill the form to reset your password</h1>
            <form
                onSubmit={handleSubmit(handleForgotPassword)}
                className="space-y-8 p-10 mt-[4rem] shadow-lg rounded-xl  bg-white"
                noValidate
            >
                <div className="flex flex-col gap-5">
                    <label
                        className="text-lg uppercase font-bold flex"
                        htmlFor="email"
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

                <input
                    type="submit"
                    value='Sent Instructions'
                    className="bg-cyan-600 w-full text-center text-white rounded-lg shadow-lg py-[1rem] border-2 border-cyan-600 hover:bg-transparent hover:text-cyan-600 hover:border-cyan-600 transition-colors cursor-pointer duration-300"
                />
            </form>

            <nav className="mt-[2rem] flex text-center flex-col space-y-[1rem]">
                <Link
                    to='/auth/login'
                    className=""
                >
                    ¿Already have an account? Log In
                </Link>

                <Link
                    to='/auth/register'
                    className=""
                >
                    ¿No account yet? Sign Up
                </Link>
            </nav>
        </>
    )
}