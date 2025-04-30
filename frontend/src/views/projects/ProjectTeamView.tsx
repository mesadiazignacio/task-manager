import { getProjectTeam, removeUserFromProject } from "@/api/TeamAPI"
import AddMemberModal from "@/components/team/AddMemberModal"
import { Menu, Transition } from "@headlessui/react"
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Link, Navigate, useNavigate, useParams } from "react-router-dom"
import { Fragment } from "react"
import { toast } from "react-toastify"

export default function ProjectTeamView() {
  const navigate = useNavigate()
  const params = useParams()
  const projectId = params.projectId!
  const queryClient = useQueryClient()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['projectTeam', projectId],
    queryFn: () => getProjectTeam(projectId),
    retry: false
  })

  const { mutate } = useMutation({
    mutationFn: removeUserFromProject,
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: (data) => {
      toast.success(data)
      queryClient.invalidateQueries({ queryKey: ['projectTeam', projectId] })
    }
  })

  if (isLoading) return <p>Loading...</p>
  if (isError) return <Navigate to={'/404'} />
  if (data) return (
    <>
      <p className="text-4xl">Team Manager</p>
      <p className="text-xl text-gray-500 font-normal">Manage your workteam</p>

      <nav className="flex gap-[1rem] mt-[0.4rem]">
        <button onClick={() => navigate(location.pathname + '?addMember=true')} type="button" className="bg-cyan-600 text-white mt-[0.5rem] rounded-lg shadow-lg py-[1rem] px-[2rem] border-2 border-transparent hover:bg-transparent hover:text-cyan-600 hover:border-cyan-600 transition-colors cursor-pointer duration-300">
          Add Member
        </button>
        <Link to={`/projects/${projectId}`} className="bg-cyan-600 text-white mt-[0.5rem] rounded-lg shadow-lg py-[1rem] px-[2rem] border-2 border-transparent hover:bg-transparent hover:text-cyan-600 hover:border-cyan-600 transition-colors cursor-pointer duration-300">
          Back
        </Link>
      </nav>

      <h2 className="text-4xl my-[2rem]">Current Members</h2>
      {data.length ? (
        <ul role="list" className="divide-y divide-gray-100 border border-gray-100 mt-10 bg-white shadow-lg">
          {data?.map((member) => (
            <li key={member._id} className="flex justify-between gap-x-6 px-5 py-10">
              <div className="flex min-w-0 gap-x-4">
                <div className="min-w-0 flex-auto space-y-2">
                  <p className="text-2xl font-black text-gray-600">
                    {member.name}
                  </p>
                  <p className="text-sm text-gray-400">
                    {member.email}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-x-6">
                <Menu as="div" className="relative flex-none">
                  <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                    <span className="sr-only">opciones</span>
                    <EllipsisVerticalIcon className="h-9 w-9" aria-hidden="true" />
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                      <Menu.Item>
                        <button
                          type='button'
                          onClick={() => mutate({ projectId, id: member._id })}
                          className='block px-3 py-1 text-sm leading-6 text-red-500'
                        >
                          Eliminar del Proyecto
                        </button>
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className='text-center py-20'>Without members yet.</p>
      )}

      <AddMemberModal />
    </>
  )
}
