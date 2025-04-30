import mongoose, { Schema, Document, Types } from "mongoose"
import Note from "./Note"

const taskStatus = {
    ON_HOLD: 'onHold',
    TO_DO: 'toDo',
    IN_PROGRESS: 'inProgress',
    UNDER_REVIEW: 'underReview',
    DONE: 'done'
} as const

export type TaskStatus = typeof taskStatus[keyof typeof taskStatus]

export interface ITask extends Document {
    name: string
    description: string
    project: Types.ObjectId
    status: TaskStatus
    completedBy: {
        user: Types.ObjectId,
        status: TaskStatus
    }[]
    notes: Types.ObjectId[]
}

export const TaskSchema : Schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    project: {
        type: Types.ObjectId,
        ref: 'Project'
    },
    status: {
        type: String,
        enum: Object.values(taskStatus),
        default: taskStatus.ON_HOLD
    },
    completedBy: [
        {
            user: {
                type: Types.ObjectId,
                ref: 'User',
                default: null
            },
            status: {
                type: String,
                enum: Object.values(taskStatus),
                default: taskStatus.ON_HOLD
            }
        }
    ],
    notes: [
        {
            type: Types.ObjectId,
            ref: 'Note'
        }
    ]
}, {timestamps: true}) // Mongoose will automatically add createdAt and updatedAt fields

// Middleware
TaskSchema.pre('deleteOne', {document: true}, async function() {
    const taskID = this._id
    if(!taskID) return
    await Note.deleteMany({task: taskID})
})

// Task model
const Task = mongoose.model<ITask>('Task', TaskSchema)
export default Task