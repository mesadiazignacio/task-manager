import { Fragment } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { Bars3Icon } from '@heroicons/react/20/solid'
import { Link } from 'react-router-dom'
import { User } from '../types'
import { useQueryClient } from '@tanstack/react-query'

type NavMenuProps = {
  name: User['name']
}

export default function NavMenu({name} : NavMenuProps) {
  const queryClient = useQueryClient()
  const logout = () => {
    localStorage.removeItem('AUTH_TOKEN')
    queryClient.invalidateQueries({queryKey: ['user']})
  }

  return (
    <Popover className="relative">
      <Popover.Button className="inline-flex items-center gap-x-1 leading-6 p-1 rounded-lg bg-transparent hover:rotate-180 transform duration-300 transition-all">
        <Bars3Icon className='w-8 h-8 text-white ' />
      </Popover.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Popover.Panel className="absolute left-1/2 z-10 mt-[1rem] flex w-screen lg:max-w-min -translate-x-1/2 lg:-translate-x-48">
          <div className="w-full lg:w-56 shrink rounded-lg bg-white text-sm leading-6 p-[1rem] text-gray-900 shadow-lg">
            <p className='text-center mt-[0.5rem]'>Hi, <span className='font-bold'>{name}</span></p>
            <Link
              to='/profile'
              className='block px-2 py-1'
            >Profile</Link>
            <Link
              to='/'
              className='block px-2 py-1'
            >My Projects</Link>
            <button
              className='block cursor-pointer font-semibold px-2 py-1 text-red-500'
              type='button'
              onClick={logout}
            >
              Log Out
            </button>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  )
}