import { addUserToProject } from "@/api/TeamAPI"
import { TeamMember } from "@/types/index"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"

type SearchResultProps = {
    user: TeamMember
    reset: () => void
}

export default function SearchResult({ user, reset }: SearchResultProps) {

    const params = useParams()
    const projectId = params.projectId!
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const { mutate } = useMutation({
        mutationFn: addUserToProject,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            reset()
            navigate(location.pathname, { replace: true })
            queryClient.invalidateQueries({queryKey:['projectTeam', projectId]})
        }
    })

    const handleAddUserToProject = () => {
        const data = {
            projectId,
            id: user._id
        }
        mutate(data)
    }

    return (
        <>
            <p className="mt-10 text-center font-bold">Results:</p>
            <div className="flex justify-between items-center">
                <p>{user.name}</p>
                <button onClick={handleAddUserToProject} className="bg-cyan-600 text-white rounded-lg shadow-lg p-[1rem] border-2 border-transparent hover:bg-transparent hover:text-cyan-600 hover:border-cyan-600 transition-colors cursor-pointer duration-300">Add Member</button>
            </div>
        </>
    )
}
