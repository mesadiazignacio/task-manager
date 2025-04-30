import api from "@/lib/axios"
import { isAxiosError } from "axios"
import { Project, Task, TaskFormData, TaskSchema } from "../types"

type TaskAPIType = {
    formData: TaskFormData
    projectId: Project['_id']
    taskId: Task['_id']
    status: Task['status']
}

export async function createTask({formData, projectId} : Pick<TaskAPIType, 'formData' | 'projectId'>) {
    try {
        const { data } = await api.post<string>(`/projects/${projectId}/tasks`, formData)
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }   
}

export async function getTaskById({projectId, taskId} : Pick<TaskAPIType, 'projectId' | 'taskId'>) {
    try {
        const { data } = await api(`/projects/${projectId}/tasks/${taskId}`)
        const response = TaskSchema.safeParse(data)
        if(response.success) {
            return response.data
        }
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }   
}

export async function updateTask({projectId, taskId, formData} : Pick<TaskAPIType, 'projectId' | 'taskId' | 'formData'>) {
    try {
        const { data } = await api.put<string>(`/projects/${projectId}/tasks/${taskId}`, formData)
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }   
}

export async function deleteTask({projectId, taskId} : Pick<TaskAPIType, 'projectId' | 'taskId'>) {
    try {
        const { data } = await api.delete<string>(`/projects/${projectId}/tasks/${taskId}`)
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }   
}

export async function updateStatus({projectId, taskId, status} : Pick<TaskAPIType, 'projectId' | 'taskId' | 'status'>) {
    try {
        const { data } = await api.post<string>(`/projects/${projectId}/tasks/${taskId}/status`, {status})
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }   
}