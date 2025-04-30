import { ProjectFormData } from "types";
import ErrorMessage from "../ErrorMessage";
import { UseFormRegister, FieldErrors } from "react-hook-form";

type ProjectFormProps = {
    register: UseFormRegister<ProjectFormData>
    errors: FieldErrors<ProjectFormData>
}

export default function ProjectForm({errors, register} : ProjectFormProps) {
    return (
        <>
            <div className="mb-5 space-y-3">
                <label htmlFor="projectName" className="text-sm uppercase font-bold">
                    Project Name
                </label>
                <input
                    id="projectName"
                    className="w-full p-3  border border-gray-200"
                    type="text"
                    placeholder="Project"
                    {...register("projectName", {
                        required: "Project name is required",
                    })}
                />

                {errors.projectName && (
                    <ErrorMessage>{errors.projectName.message}</ErrorMessage>
                )}
            </div>

            <div className="mb-5 space-y-3">
                <label htmlFor="clientName" className="text-sm uppercase font-bold">
                    Client Name
                </label>
                <input
                    id="clientName"
                    className="w-full p-3  border border-gray-200"
                    type="text"
                    placeholder="Client"
                    {...register("clientName", {
                        required: "Client name is required",
                    })}
                />

                {errors.clientName && (
                    <ErrorMessage>{errors.clientName.message}</ErrorMessage>
                )}
            </div>

            <div className="mb-5 space-y-3">
                <label htmlFor="description" className="text-sm uppercase font-bold">
                    Description
                </label>
                <textarea
                    id="description"
                    className="w-full p-3  border border-gray-200"
                    placeholder="Description"
                    {...register("description", {
                        required: "Description is required"
                    })}
                />

                {errors.description && (
                    <ErrorMessage>{errors.description.message}</ErrorMessage>
                )}
            </div>
        </>
    )
}