export default function ErrorMessage({children} : {children: React.ReactNode}) {
  return (
    <div className="text-center p-[1rem] bg-white text-lg">{children}</div>
  )
}
