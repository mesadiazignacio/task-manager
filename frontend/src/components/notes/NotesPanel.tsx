import { Task } from "@/types/index";
import AddNoteForm from "./AddNoteForm";
import NoteDetail from "./NoteDetail";


type NotesPanelProps = {
  notes: Task['notes']
}
export default function NotesPanel({notes} : NotesPanelProps) {
  return (
    <>
        <AddNoteForm />

        <div className="divide-y divide-gray-100 mt-[2rem]">
          {notes.length ? (
            <>
              <p className="my-[1rem] text-2xl">Notes:</p>
              {notes.map(note => <NoteDetail key={note._id} note={note} />)}
            </>
          ) : <p className="text-center pt-[1rem]">Withuout notes yet</p>}
        </div>
    </>
  )
}
