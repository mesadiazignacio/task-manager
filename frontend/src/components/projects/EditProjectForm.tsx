import { Link, useNavigate } from "react-router-dom";
import ProjectForm from "./ProjectForm";
import { Project, ProjectFormData } from "@/types/index";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateProject } from "@/api/ProjectAPI";
import { toast } from "react-toastify";

type EditProjectFormProps = {
    data: ProjectFormData
    projectId: Project['_id']
}

export default function EditProjectForm({data, projectId} : EditProjectFormProps) {
    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: {
        projectName: data.projectName,
        clientName: data.clientName,
        description: data.description
    }})

    const queryClient = useQueryClient()

    const { mutate } = useMutation({
        mutationFn: updateProject,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: ['projects']})
            queryClient.invalidateQueries({queryKey: ['editProject', projectId]})
            toast.success(data)
            navigate('/')
        }
    })

    const handleForm = (formData : ProjectFormData) => {
        const data = {
            formData, projectId
        }
        mutate(data)
    }

    return (
        <div>
            <p className="text-4xl">Project Editor</p>
            <p className="text-xl text-gray-500 font-normal">Custom the following form</p>
            <nav className="my-[2rem]">
                <Link to='/' className="bg-cyan-600 text-white rounded-lg shadow-lg p-[1rem] border-2 border-transparent hover:bg-transparent hover:text-cyan-600 hover:border-cyan-600 transition-colors cursor-pointer duration-300">Back</Link>
            </nav>
            <form onSubmit={handleSubmit(handleForm)} noValidate className="bg-slate-100 shadow-lg p-[2rem] rounded-lg">
                <ProjectForm
                    register={register}
                    errors={errors}
                />
                <input type="submit" value='Custom Project' className="bg-cyan-600 w-full text-center text-white rounded-lg shadow-lg p-[1rem] border-2 border-white hover:bg-transparent hover:text-cyan-600 hover:border-cyan-600 transition-colors cursor-pointer duration-300" />
            </form>
        </div>
    )
}
