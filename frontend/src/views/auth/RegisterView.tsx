import { useForm } from "react-hook-form";
import { UserRegistrationForm } from "@/types/index";
import { useMutation } from '@tanstack/react-query'
import ErrorMessage from "@/components/ErrorMessage";
import { Link } from "react-router-dom";
import { createAccount } from "@/api/AuthAPI";
import { toast } from "react-toastify";

export default function RegisterView() {

    const initialValues: UserRegistrationForm = {
        name: '',
        email: '',
        password: '',
        passwordConfirmation: '',
    }

    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<UserRegistrationForm>({ defaultValues: initialValues });

    const { mutate } = useMutation({
        mutationFn: createAccount,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            reset()
        }
    })

    const password = watch('password');

    const handleRegister = (formData: UserRegistrationForm) => mutate(formData)

    return (
        <>
            <h1 className="text-2xl text-gray-500 font-normal">Fill the form to sign up</h1>

            <form
                onSubmit={handleSubmit(handleRegister)}
                className="space-y-8 mt-[4rem] shadow-lg rounded-xl p-10 bg-white"
                noValidate
            >
                <div className="flex flex-col">
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

                <div className="flex flex-col">
                    <label
                        className="text-lg uppercase font-bold flex"
                    >Name</label>
                    <input
                        type="name"
                        placeholder="Name"
                        className="w-full p-3  border-gray-300 border"
                        {...register("name", {
                            required: "Name is required",
                        })}
                    />
                    {errors.name && (
                        <ErrorMessage>{errors.name.message}</ErrorMessage>
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
                            minLength: {
                                value: 8,
                                message: 'Password must be a minimum of 8 characters'
                            }
                        })}
                    />
                    {errors.password && (
                        <ErrorMessage>{errors.password.message}</ErrorMessage>
                    )}
                </div>

                <div className="flex flex-col">
                    <label
                        className="text-lg uppercase font-bold flex"
                    >Repeat Password</label>

                    <input
                        id="password_confirmation"
                        type="password"
                        placeholder="Repeat Password"
                        className="w-full p-3  border-gray-300 border"
                        {...register("passwordConfirmation", {
                            required: "Repeat Password is required",
                            validate: value => value === password || 'Passwords are not equal'
                        })}
                    />

                    {errors.passwordConfirmation && (
                        <ErrorMessage>{errors.passwordConfirmation.message}</ErrorMessage>
                    )}
                </div>

                <input
                    type="submit"
                    value='Sign Up'
                    className="bg-cyan-600 w-full text-center text-white rounded-lg shadow-lg py-[1rem] border-2 border-cyan-600 hover:bg-transparent hover:text-cyan-600 hover:border-cyan-600 transition-colors cursor-pointer duration-300"
                />
            </form>

            <nav className="mt-[2rem] flex flex-col">
                <Link to={'/auth/login'}>¿Already have an account?</Link>
            </nav>
        </>
    )
}