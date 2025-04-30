import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import ErrorMessage from "../ErrorMessage";
import { TeamMemberForm } from "@/types/index";
import { findUserByEmail } from "@/api/TeamAPI";
import SearchResult from "./SearchResult";

export default function AddMemberForm() {
    const initialValues: TeamMemberForm = {
        email: ''
    }
    const params = useParams()
    const projectId = params.projectId!

    const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: initialValues })

    const mutation = useMutation({
        mutationFn: findUserByEmail
    })

    const handleSearchUser = async (formData : TeamMemberForm) => {
        const data = {projectId, formData}
        mutation.mutate(data)
    }

    const resetData = () => {
        reset(),
        mutation.reset()
    }
    return (
        <>

            <form
                className="mt-[1rem] space-y-[1rem]"
                onSubmit={handleSubmit(handleSearchUser)}
                noValidate
            >

                <div className="flex flex-col">
                    <label
                        className="text-sm uppercase font-bold"
                        htmlFor="name"
                    >User email</label>
                    <input
                        id="name"
                        type="text"
                        placeholder="Email"
                        className="w-full p-3  border-gray-300 border"
                        {...register("email", {
                            required: "Email is required",
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
                    className="bg-cyan-600 mt-[1rem] text-white rounded-lg shadow-lg py-[1rem] w-full border-2 border-transparent hover:bg-transparent hover:text-cyan-600 hover:border-cyan-600 transition-colors cursor-pointer duration-300"
                    value='Search User'
                />
            </form>

            {mutation.isPending && <p className="text-center">Loading...</p>}
            {mutation.error && <p className="text-center">{mutation.error.message}</p>}
            {mutation.data && <SearchResult user={mutation.data} reset={resetData}/>}
        </>
    )
}