import { Router } from "express"
import { body, param } from 'express-validator'
import { ProjectController } from "../controllers/ProjectController"
import { TaskController } from "../controllers/TaskController"
import { handleInputErrors } from "../middleware/validation"
import { projectExists } from "../middleware/project"
import { hasAuthorization, taskBelongsToProject, taskExists } from "../middleware/task"
import { authenticate } from "../middleware/auth"
import { TeamMemberController } from "../controllers/TeamController"
import { NoteController } from "../controllers/NoteController"

const router = Router()

router.use(authenticate)

//** Routes for Project */
router.post('/',
    body('projectName').notEmpty().withMessage('Project name is required'),
    body('clientName').notEmpty().withMessage('Client name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    handleInputErrors,
    ProjectController.createProject
)

router.get('/',
    ProjectController.getAllProjects)

router.get('/:id',
    param('id').isMongoId().withMessage('Invalid project ID'),
    handleInputErrors,
    ProjectController.getProjectById
)

//** Routes for Tasks */
router.param('projectId', projectExists)

router.put('/:projectId',
    param('projectId').isMongoId().withMessage('Invalid project ID'),
    body('projectName').notEmpty().withMessage('Project name is required'),
    body('clientName').notEmpty().withMessage('Client name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    handleInputErrors,
    hasAuthorization,
    ProjectController.updateProject
)

router.delete('/:projectId',
    param('projectId').isMongoId().withMessage('Invalid project ID'),
    handleInputErrors,
    hasAuthorization,
    ProjectController.deleteProject
)

router.post('/:projectId/tasks',
    hasAuthorization,
    body('name').notEmpty().withMessage('Task name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    handleInputErrors,
    TaskController.createTask
)

router.param('taskId', taskExists)
router.param('taskId', taskBelongsToProject)

router.get('/:projectId/tasks',
    handleInputErrors,
    TaskController.getProjectTasks
)

router.get('/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('Invalid task ID'),
    handleInputErrors,
    TaskController.getTaskById
)

router.put('/:projectId/tasks/:taskId',
    hasAuthorization,
    param('taskId').isMongoId().withMessage('Invalid task ID'),
    body('name').notEmpty().withMessage('Task name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    handleInputErrors,
    TaskController.updateTask
)

router.delete('/:projectId/tasks/:taskId',
    hasAuthorization,
    param('taskId').isMongoId().withMessage('Invalid task ID'),
    handleInputErrors,
    TaskController.deleteTask
)

router.post('/:projectId/tasks/:taskId/status',
    param('taskId').isMongoId().withMessage('Invalid task ID'),
    body('status').notEmpty().withMessage('Status is required'),
    handleInputErrors,
    TaskController.updateTaskStatus
)

//** Routes for Teams */
router.post('/:projectId/team/find',
    body('email').isEmail().toLowerCase().withMessage('Invalid Email').notEmpty().withMessage('Email is required'),
    handleInputErrors,
    TeamMemberController.findMemberByEmail
)

router.get('/:projectId/team',
    TeamMemberController.getProjectTeam
)

router.post('/:projectId/team',
    body('id').isMongoId().withMessage('Invalid user ID'),
    handleInputErrors,
    TeamMemberController.addMemberById
)

router.delete('/:projectId/team/:userId',
    param('userId'),
    body('id').isMongoId().withMessage('Invalid user ID'),
    handleInputErrors,
    TeamMemberController.removeMemberById
)

//** Routes for Notes */
router.post('/:projectId/tasks/:taskId/notes',
    body('content').notEmpty().withMessage('Note content is required'),
    handleInputErrors,
    NoteController.createNote
)

router.get('/:projectId/tasks/:taskId/notes',
    NoteController.getTaskNotes
)

router.get('/:projectId/tasks/:taskId/notes/:noteId',
    param('noteId').isMongoId().withMessage('Invalid note ID'),
    handleInputErrors,
    NoteController.deleteNote
)

export default router