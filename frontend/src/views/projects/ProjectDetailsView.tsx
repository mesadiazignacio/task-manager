import { Link, Navigate, useNavigate, useParams } from "react-router-dom"
import { useQuery } from '@tanstack/react-query'
import { getFullProject } from "@/api/ProjectAPI"
import AddTaskModal from "@/components/tasks/AddTaskModal"
import TaskList from "@/components/tasks/TaskList"
import EditTaskData from "@/components/tasks/EditTaskData"
import TaskModalDetails from "@/components/tasks/TaskModalDetails"
import { useAuth } from "@/hooks/useAuth"
import { isManager } from "@/utils/policies"
import { useMemo } from "react"

export default function ProjectDetailsView() {
  const { data: user, isLoading: authLoading } = useAuth()
  const navigate = useNavigate()
  const params = useParams()
  const projectId = params.projectId!
  const { data, isLoading, isError } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => getFullProject(projectId),
    retry: false,
  })

  const canEdit = useMemo(() => data?.manager === user?._id , [data, user])
  if (isLoading && authLoading) return 'Loading...'
  if (isError) return <Navigate to={'/'} />

  if (data && user) return (
    <>
      <p className="text-4xl">{data.projectName}</p>
      <p className="text-xl text-gray-500 font-normal">{data.description}</p>
      {isManager(data.manager, user._id) && (
        <nav className="flex gap-[1rem] mt-[0.4rem]">
          <button onClick={() => navigate(location.pathname + '?newTask=true')} type="button" className="bg-cyan-600 text-white mt-[0.5rem] rounded-lg shadow-lg py-[1rem] px-[2rem] border-2 border-transparent hover:bg-transparent hover:text-cyan-600 hover:border-cyan-600 transition-colors cursor-pointer duration-300">
            Add Task
          </button>
          <Link to={'team'} className="bg-cyan-600 text-white mt-[0.5rem] rounded-lg shadow-lg py-[1rem] px-[2rem] border-2 border-transparent hover:bg-transparent hover:text-cyan-600 hover:border-cyan-600 transition-colors cursor-pointer duration-300">
            Partners
          </Link>
        </nav>
      )}
      <TaskList
        tasks={data.tasks}
        canEdit={canEdit}
      />
      <AddTaskModal />
      <EditTaskData />
      <TaskModalDetails />
    </>
  )
}
