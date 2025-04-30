import { useForm } from "react-hook-form"
import ErrorMessage from "../ErrorMessage"
import { User, UserProfileForm } from "@/types/index"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateProfile } from "@/api/ProfileAPI"
import { toast } from "react-toastify"

type ProfileFormProps = {
    data: User
}

export default function ProfileForm({ data } : ProfileFormProps) {
    const { register, handleSubmit, formState: { errors } } = useForm<UserProfileForm>({ defaultValues: data })
    const queryClient = useQueryClient()
    const { mutate } = useMutation({
        mutationFn: updateProfile,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            queryClient.invalidateQueries({queryKey: ['user']})
        },
    })

    const handleEditProfile = (formData : UserProfileForm) => mutate(formData)

    return (
        <>
            <div className="mx-auto max-w-3xl">
                <h1 className="text-4xl">My Profile</h1>
                <p className="text-xl text-gray-500 font-normal">Here you could update your information</p>

                <form
                    onSubmit={handleSubmit(handleEditProfile)}
                    className="mt-[1rem] bg-white shadow-2xl p-[4rem] rounded-lg"
                    noValidate
                >
                    <div className="mb-[1rem] space-y-[1rem]">
                        <label
                            className="text-sm uppercase font-bold"
                            htmlFor="name"
                        >Name</label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Empty"
                            className="w-full p-3  border border-gray-200"
                            {...register("name", {
                                required: "Name is required",
                            })}
                        />
                        {errors.name && (
                            <ErrorMessage>{errors.name.message}</ErrorMessage>
                        )}
                    </div>

                    <div className="mb-5 space-y-3">
                        <label
                            className="text-sm uppercase font-bold"
                            htmlFor="password"
                        >E-mail</label>
                        <input
                            id="text"
                            type="email"
                            placeholder="Empty"
                            className="w-full p-3  border border-gray-200"
                            {...register("email", {
                                required: "EL e-mail es obligatorio",
                                pattern: {
                                    value: /\S+@\S+\.\S+/,
                                    message: "E-mail no válido",
                                },
                            })}
                        />
                        {errors.email && (
                            <ErrorMessage>{errors.email.message}</ErrorMessage>
                        )}
                    </div>
                    <input
                        type="submit"
                        value='Save Changes'
                        className="bg-cyan-600 text-white rounded-lg w-full shadow-lg py-[1rem] border-2 border-transparent hover:bg-transparent hover:text-cyan-600 hover:border-cyan-600 transition-colors cursor-pointer duration-300"
                    />
                </form>
            </div>
        </>
    )
}