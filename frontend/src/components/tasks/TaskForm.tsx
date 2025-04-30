import { FieldErrors, UseFormRegister } from "react-hook-form"
import { TaskFormData } from "@/types/index";
import ErrorMessage from "../ErrorMessage";

type TaskFormProps = {
    errors: FieldErrors<TaskFormData>
    register: UseFormRegister<TaskFormData>
}

export default function TaskForm({ errors, register }: TaskFormProps) {
    return (
        <>
            <div className="flex flex-col gap-y-[1rem]">
                <div className="flex flex-col">
                    <label
                        className="text-sm uppercase font-bold"
                        htmlFor="name"
                    >Task Name</label>
                    <input
                        id="name"
                        type="text"
                        placeholder="Task"
                        className="w-full p-3  border-gray-300 border"
                        {...register("name", {
                            required: "Task name is required",
                        })}
                    />
                    {errors.name && (
                        <ErrorMessage>{errors.name.message}</ErrorMessage>
                    )}
                </div>

                <div className="flex flex-col">
                    <label
                        className="text-sm uppercase font-bold"
                        htmlFor="description"
                    >Description</label>
                    <textarea
                        id="description"
                        placeholder="Description"
                        className="w-full p-3  border-gray-300 border"
                        {...register("description", {
                            required: "Description is required"
                        })}
                    />
                    {errors.description && (
                        <ErrorMessage>{errors.description.message}</ErrorMessage>
                    )}
                </div>
            </div>
        </>
    )
}