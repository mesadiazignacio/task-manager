import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'
import { Link, useNavigate } from "react-router-dom"
import { useQuery } from '@tanstack/react-query'
import { getProjects } from "@/api/ProjectAPI"
import { useAuth } from '@/hooks/useAuth'
import { isManager } from '@/utils/policies'
import DeleteProjectModal from '@/components/projects/DeleteProjectModal'

export default function DashboardView() {

  const navigate = useNavigate()
  const { data: user, isLoading: authLoading } = useAuth()
  const { data, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects
  })

  if (isLoading && authLoading) return 'Loading...'

  if (data && user) return (
    <>
      <p className="text-4xl">Dashboard</p>
      <p className="text-xl text-gray-500 font-normal">Manage your projects</p>

      <nav className="my-[2rem]">
        <Link to='/projects/create' className="bg-cyan-600 text-white rounded-lg shadow-lg py-[1rem] px-[2rem] border-2 border-transparent hover:bg-transparent hover:text-cyan-600 hover:border-cyan-600 transition-colors cursor-pointer duration-300">New Project</Link>
      </nav>

      {data.length ? (
        <ul role="list" className="divide-y divide-gray-100 border rounded-lg border-gray-100 mt-[2rem] bg-white shadow-2xl">
          {data.map((project) => (
            <li key={project._id} className="flex justify-between gap-x-6 px-5 py-10">
              <div className="flex min-w-0 gap-x-4">
                <div className="min-w-0 flex-auto space-y-2">
                  { isManager(project.manager, user._id)  ? 
                    <p>Manager</p>
                   : 
                    <p>Team Member</p>
                  }
                  <Link to={`/projects/${project._id}`}
                    className="text-gray-600 cursor-pointer hover:underline text-3xl font-bold"
                  >{project.projectName}</Link>
                  <p className="text-sm text-gray-400">
                    Cliente: {project.clientName}
                  </p>
                  <p className="text-sm text-gray-400">
                    {project.description}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-x-6">
                <Menu as="div" className="relative flex-none">
                  <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                    <EllipsisVerticalIcon className="h-9 w-9" aria-hidden="true" />
                  </Menu.Button>
                  <Transition as={Fragment} enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95">
                    <Menu.Items
                      className="absolute right-0 z-10 mt-[1rem] w-56 origin-top-right rounded-lg bg-white p-[1rem] shadow-lg ring-1 ring-gray-900/5 focus:outline-none"
                    >
                      <Menu.Item>
                        <Link to={`/projects/${project._id}`}
                          className='block px-2 py-1 text-sm leading-6 text-gray-900'>
                          Show Project
                        </Link>
                      </Menu.Item>
                      {isManager(project.manager, user._id)  && (
                        <>
                        <Menu.Item>
                        <Link to={`/projects/${project._id}/edit`}
                          className='block px-2 py-1 text-sm leading-6 text-gray-900'>
                          Edit Project
                        </Link>
                      </Menu.Item>
                      <Menu.Item>
                        <button
                          type='button'
                          className='block px-2 py-1 text-sm cursor-pointer font-semibold leading-6 text-red-500'
                          onClick={() => navigate(location.pathname + `?deleteProject=${project._id}`)}
                        >
                          Delete Project
                        </button>
                      </Menu.Item>
                        </>
                      )}
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-lg">Make a project.
        </p>
      )}
      <DeleteProjectModal />
    </>
  )
}
