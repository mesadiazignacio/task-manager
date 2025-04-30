import { Router } from "express"
import { body, param } from "express-validator"
import { AuthController } from "../controllers/AuthController"
import { handleInputErrors } from "../middleware/validation"
import { authenticate } from "../middleware/auth"

const router = Router()

router.post('/register',
    body('name').notEmpty().withMessage('Name is required'),
    body('password').isLength({min: 8}).withMessage('Password must be at least 8 characters long'),
    body('passwordConfirmation').custom((value, {req}) => {
        if(value !== req.body.password) {
            throw new Error('Password confirmation does not match password')
        }
        return true
    }),
    body('email').isEmail().withMessage('Invalid email format'),
    handleInputErrors,
    AuthController.createAccount
)

router.post('/confirm-account',
    body('token').notEmpty().withMessage('Token is required'),
    handleInputErrors,
    AuthController.confirmAccount
)

router.post('/login',
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').notEmpty().withMessage('Password is required'),
    handleInputErrors,
    AuthController.login
)

router.post('/request-code',
    body('email').isEmail().withMessage('Invalid email format'),
    handleInputErrors,
    AuthController.requestConfirmationCode
)

router.post('/forgot-password',
    body('email').isEmail().withMessage('Invalid email format'),
    handleInputErrors,
    AuthController.forgotPassword
)

router.post('/validate-token',
    body('token').notEmpty().withMessage('Token is required'),
    handleInputErrors,
    AuthController.validateToken
)

router.post('/update-password/:token',
    param('token').isNumeric().withMessage('Token must be numeric'),
    body('password').isLength({min: 8}).withMessage('Password must be at least 8 characters long'),
    body('passwordConfirmation').custom((value, {req}) => {
        if(value !== req.body.password) {
            throw new Error('Password confirmation does not match password')
        }
        return true
    }),
    handleInputErrors,
    AuthController.updatePasswordWithToken
)

router.get('/user',
    authenticate,
    AuthController.user
)

/** Profile */
router.put('/profile',
    authenticate,
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email format'),
    handleInputErrors,
    AuthController.updateProfile
)

router.post('/update-password',
    authenticate,
    body('currentPassword').notEmpty().withMessage('Current Password is required'),
    body('password').isLength({min: 8}).withMessage('Password must be at least 8 characters long'),
    body('passwordConfirmation').custom((value, {req}) => {
        if(value !== req.body.password) {
            throw new Error('Password confirmation does not match password')
        }
        return true
    }),
    handleInputErrors,
    AuthController.updateCurrentUserPassword
)

router.post('/check-password',
    authenticate,
    body('password').notEmpty().withMessage('Password is required'),
    handleInputErrors,
    AuthController.checkPassword
)

export default router