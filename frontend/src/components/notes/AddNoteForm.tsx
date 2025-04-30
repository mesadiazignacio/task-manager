import { NoteFormData } from '@/types/index'
import { useForm } from 'react-hook-form'
import ErrorMessage from '../ErrorMessage'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createNote } from '@/api/NoteAPI'
import { toast } from 'react-toastify'
import { useLocation, useParams } from 'react-router-dom'

export default function AddNoteForm() {

    const queryClient = useQueryClient()
    const params = useParams()
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const projectId = params.projectId!
    const taskId = queryParams.get('viewTask')!
    const initialValues : NoteFormData = {
        content: ''
    }

    const { register, handleSubmit, reset, formState: {errors} } = useForm({defaultValues: initialValues})

    const { mutate } = useMutation({
        mutationFn: createNote,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            queryClient.invalidateQueries({ queryKey: ['task', taskId] })
        }
    })

    const handleAddNote = (formData : NoteFormData) => {
        mutate({
            projectId,
            taskId,
            formData
        })
        reset()
    }
    return (
        <form onSubmit={handleSubmit(handleAddNote)} className="space-y-[1rem] novalidate">
            <div className="flex flex-col gap-[1rem]">
                <label className="font-bold" htmlFor="content">Create Note</label>
                <input {...register('content', {required: 'Note content is required'})} id="content" type="text" placeholder="Note content" className="w-full p-[1rem] border border-gray-300" />
                
                {errors.content && (
                    <ErrorMessage>{errors.content.message}</ErrorMessage>
                )}

            </div>

            <input type="submit" value='Create Note' className="bg-cyan-600 text-white mt-[0.5rem] rounded-lg shadow-lg py-[1rem] px-[2rem] border-2 border-transparent hover:bg-transparent hover:text-cyan-600 hover:border-cyan-600 transition-colors cursor-pointer duration-300" />
        </form>
    )
}
