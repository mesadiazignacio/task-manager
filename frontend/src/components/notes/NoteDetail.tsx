import { deleteNote } from "@/api/NoteAPI"
import { useAuth } from "@/hooks/useAuth"
import { Note } from "@/types/index"
import { formatDate } from "@/utils/utils"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useMemo } from "react"
import { useLocation, useParams } from "react-router-dom"
import { toast } from "react-toastify"

type NoteDetailProps = {
    note: Note
}

export default function NoteDetail({note} : NoteDetailProps) {
    const { data, isLoading } = useAuth()
    const canDelete = useMemo(() => data?._id === note.createdBy._id , [data])
    const params = useParams()
    const projectId = params.projectId!
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const taskId = queryParams.get('viewTask')!
    const queryClient = useQueryClient()

    const { mutate } = useMutation({
        mutationFn: deleteNote,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            queryClient.invalidateQueries({ queryKey: ['task', taskId] })
        }
    })
    if(isLoading) return <p>Loading...</p>
  if(data)return (
    <div className="p-[1rem] justify-between items-center">
        <div>
            <p>
                {note.content} by: <span className="font-bold">{note.createdBy.name}</span>
            </p>
            <p className="text-sm text-slate-500">
                {formatDate(note.createdAt)}
            </p>
        </div>
        {canDelete && (
            <button onClick={() => mutate({projectId, taskId, noteId: note._id})} type="button" className="bg-red-600 text-white mt-[0.5rem] rounded-lg shadow-lg py-[1rem] px-[2rem] border-2 border-transparent hover:bg-transparent hover:text-red-600 hover:border-red-600 transition-colors cursor-pointer duration-300">Delete</button>
        )}
    </div>
  )
}
