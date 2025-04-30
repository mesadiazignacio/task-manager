import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import TaskForm from './TaskForm';
import { TaskFormData } from '@/types/index';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask } from '@/api/TaskAPI';
import { toast } from 'react-toastify';

export default function AddTaskModal() {
    const navigate = useNavigate()

    //** Read if modal exist */
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const modalTask = queryParams.get('newTask')
    const show = modalTask ? true : false

    /** Take projectId */
    const params = useParams()
    const projectId = params.projectId!

    const initialValues: TaskFormData = {
        name: '',
        description: ''
    }

    const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: initialValues })

    const queryClient = useQueryClient()

    const { mutate } = useMutation({
        mutationFn: createTask,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: ['editProject', projectId]})
            toast.success(data)
            reset()
            navigate(location.pathname, { replace: true })
        }
    })

    const handleCreateTask = (formData: TaskFormData) => {
        const data = {
            formData, projectId
        }
        mutate(data)
    }

    return (
        <>
            <Transition appear show={show} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => navigate(location.pathname, { replace: true })}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/60" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-16">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-4xl"
                                    >
                                        Add task to the project
                                    </Dialog.Title>
                                    <p className="text-xl text-gray-500 font-normal">Complete the form y create a task</p>

                                    <form noValidate onSubmit={handleSubmit(handleCreateTask)} className='mt-[1rem]'>
                                        <TaskForm
                                            register={register}
                                            errors={errors}
                                        />
                                        <input type="submit" value='Send Task' className='bg-cyan-600 mt-[2rem] w-full text-center text-white rounded-lg shadow-lg py-[1rem] border-2 border-cyan-600 hover:bg-transparent hover:text-cyan-600 hover:border-cyan-600 transition-colors cursor-pointer duration-300' />
                                    </form>

                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}