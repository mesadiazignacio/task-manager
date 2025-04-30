import { Link, useNavigate } from "react-router-dom"
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import ProjectForm from "@/components/projects/ProjectForm"
import { ProjectFormData } from "@/types/index"
import { createProject } from "@/api/ProjectAPI"
import { useMutation } from "@tanstack/react-query"

export default function CreateProjectView() {


    const navigate = useNavigate()

    const initialValues: ProjectFormData = {
        projectName: "",
        clientName: "",
        description: ""
    }

    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues })

    const { mutate } = useMutation({
        mutationFn: createProject,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            navigate('/')
        }
    })


    const handleForm = (formData: ProjectFormData) => mutate(formData)

    return (
        <div>
            <p className="text-4xl">Project Creator</p>
            <p className="text-xl text-gray-500 font-normal">Complete the following form</p>
            <nav className="my-[2rem]">
                <Link to='/' className="bg-cyan-600 text-white rounded-lg shadow-lg p-[1rem] border-2 border-transparent hover:bg-transparent hover:text-cyan-600 hover:border-cyan-600 transition-colors cursor-pointer duration-300">Back</Link>
            </nav>
            <form onSubmit={handleSubmit(handleForm)} noValidate className="bg-white shadow-2xl p-[2rem] rounded-lg">
                <ProjectForm
                    register={register}
                    errors={errors}
                />
                <input type="submit" value='Create Project' className="bg-cyan-600 w-full text-center text-white rounded-lg shadow-lg p-[1rem] border-2 border-transparent hover:bg-transparent hover:text-cyan-600 hover:border-cyan-600 transition-colors cursor-pointer duration-300" />
            </form>
        </div>
    )
}