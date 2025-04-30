import { useDroppable } from "@dnd-kit/core"

type DropTaskProps = {
  status: string
}

export default function DropTask({ status }: DropTaskProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: status
  })

  const style = {
    opacity: isOver ? 0.5 : undefined,
  }
  return (
    <div style={style} ref={setNodeRef} className="text-sm font-bold uppercase border border-dashed border-slate-500 mt-[1rem] grid place-content-center rounded-lg text-slate-500 p-[1rem] shadow-lg">Drop</div>
  )
}
