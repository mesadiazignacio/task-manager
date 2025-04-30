import { z } from 'zod';

export const authSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    currentPassword: z.string(),
    password: z.string(),
    passwordConfirmation: z.string(),
    token: z.string()
})

export const userSchema = authSchema.pick({
    name: true,
    email: true
}).extend({
    _id: z.string()
})

const noteSchema = z.object({
    _id: z.string(),
    content: z.string(),
    createdBy: userSchema,
    task: z.string(),
    createdAt: z.string()
})

export type Note = z.infer<typeof noteSchema>
export type NoteFormData = Pick<Note, 'content'>

export const taskStatusSchema = z.enum(["onHold", "toDo", "inProgress", "underReview", "done"])

export const TaskSchema = z.object({
    _id: z.string(),
    name: z.string(),
    description: z.string(),
    project: z.string(),
    status: taskStatusSchema,
    completedBy: z.array(z.object({
        _id: z.string(),
        user: userSchema,
        status: taskStatusSchema
    })),
    notes: z.array(noteSchema.extend({
        createdBy: userSchema
    })),
    createdAt: z.string(),
    updatedAt: z.string()
})

export const taskProjectSchema = TaskSchema.pick({
    _id: true,
    name: true,
    description: true,
    status: true,
})

export const ProjectSchema = z.object({
    _id: z.string(),
    projectName: z.string(),
    clientName: z.string(),
    description: z.string(),
    manager: z.string(userSchema.pick({_id: true})),
    tasks: z.array(taskProjectSchema),
    team: z.array(z.string(userSchema.pick({_id: true}))),
})

export const DashboardProjectSchema = z.array(
    ProjectSchema.pick({
        _id: true,
        projectName: true,
        clientName: true,
        description: true,
        manager: true
    })
)

export const editPRojectSchema = ProjectSchema.pick({
    projectName: true,
    clientName: true,
    description: true
})

const teamMemberSchema = userSchema.pick({
    name: true,
    email: true,
    _id: true
})

export const teamMembersSchema = z.array(teamMemberSchema)

export type Auth  = z.infer<typeof authSchema>
export type UserLoginForm = Pick<Auth, 'email' | 'password'>
export type UserRegistrationForm = Pick<Auth, 'name' | 'email' | 'password' | 'passwordConfirmation'>
export type RequestConfirmationCodeForm = Pick<Auth, 'email'>
export type ConfirmToken = Pick<Auth, 'token'>
export type CheckPasswordForm = Pick<Auth, 'password'>
export type ForgotPasswordForm = Pick<Auth, 'email'>
export type NewPasswordForm = Pick<Auth, 'password' | 'passwordConfirmation'>
export type UpdateCurrentUserPasswordForm = Pick<Auth, 'currentPassword' | 'password' | 'passwordConfirmation'>
export type User = z.infer<typeof userSchema>
export type UserProfileForm = Pick<User, 'name' | 'email'>

export type TaskStatus = z.infer<typeof taskStatusSchema>

export type Task = z.infer<typeof TaskSchema>
export type TaskFormData = Pick<Task, 'name' | 'description'>
export type TaskProject = z.infer<typeof taskProjectSchema>

export type Project = z.infer<typeof ProjectSchema>
export type ProjectFormData = Pick<Project, 'projectName' | 'clientName' | 'description'>

export type TeamMember = z.infer<typeof teamMemberSchema>
export type TeamMemberForm = Pick<TeamMember, 'email'>