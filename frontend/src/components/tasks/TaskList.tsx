import { Project, TaskProject, TaskStatus } from "@/types/index"
import TaskCard from "./TaskCard"
import { statusTranslation } from "@/locales/en"
import DropTask from "./DropTask"
import { DndContext, DragEndEvent } from "@dnd-kit/core"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"
import { useParams } from "react-router-dom"
import { updateStatus } from "@/api/TaskAPI"

type TaskListProps = {
  tasks: TaskProject[]
  canEdit: boolean
}

type GroupTasks = {
  [key: string]: TaskProject[]
}

const initialStatusGroups: GroupTasks = {
  onHold: [],
  toDo: [],
  inProgress: [],
  underReview: [],
  done: []
}

const statusStyles: { [key: string]: string } = {
  onHold: 'border-t-slate-500',
  toDo: 'border-t-red-500',
  inProgress: 'border-t-blue-500',
  underReview: 'border-t-amber-500',
  done: 'border-t-emerald-500'
}

export default function TaskList({ tasks, canEdit }: TaskListProps) {
  const queryClient = useQueryClient()
  const params = useParams()
  const projectId = params.projectId!
  const { mutate } = useMutation({
    mutationFn: updateStatus,
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: (data) => {
      toast.success(data)
      queryClient.invalidateQueries({ queryKey: ['project', projectId] })
    }
  })
  const groupedTasks = tasks.reduce((acc, task) => {
    let currentGroup = acc[task.status] ? [...acc[task.status]] : [];
    currentGroup = [...currentGroup, task]
    return { ...acc, [task.status]: currentGroup };
  }, initialStatusGroups);

  const handleDragEnd = (e: DragEndEvent) => {
    const { over, active } = e
    if (over && over.id) {
      const taskId = active.id.toString()
      const status = over.id as TaskStatus
      mutate({ projectId, taskId, status })
      queryClient.setQueryData(['project', projectId], (prevData : Project) => {
        const updatedTask = prevData.tasks.map((task) => {
          if(task._id === taskId) {
            return {
              ...task,
              status
            }
          }
          return task
        })
        return {
          ...prevData,
          tasks: updatedTask
        }
      })
    }
  }

  return (
    <>
      <h2 className="text-4xl my-[2rem]">Tasks</h2>

      <div className='flex gap-5 overflow-x-scroll 2xl:overflow-auto pb-32'>
        <DndContext onDragEnd={handleDragEnd} >
          {Object.entries(groupedTasks).map(([status, tasks]) => (
            <div key={status} className='min-w-[300px] 2xl:min-w-0 2xl:w-1/5'>
              <p className={`uppercase font-bold border border-slate-300 border-t-[1rem] rounded-lg shadow-xl p-[1rem] ${statusStyles[status]}`}>{statusTranslation[status]}</p>
              <DropTask status={status} />
              <ul className='mt-5 space-y-5'>
                {tasks.length === 0 ? (
                  <li className="text-gray-500 text-center pt-3">No tasks.</li>
                ) : (
                  tasks.map(task => <TaskCard key={task._id} task={task} canEdit={canEdit} />)
                )}
              </ul>
            </div>
          ))}
        </DndContext>
      </div>
    </>
  )
}
