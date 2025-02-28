import {Router} from 'express'
import { signup, login } from '../controller/auth.controller'
import { errorHAndler } from '../error-handler'

 const authRouter:Router = Router()
 authRouter.post('/signup', errorHAndler(signup))
 authRouter.post('/login', errorHAndler(login))


 export default authRouter
