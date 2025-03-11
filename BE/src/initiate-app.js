import db_connection from "../DB/connection.js"
import { globalResponse } from "./middlewares/global-response.middleware.js"
import * as routers from "./modules/index.routes.js"
import { DeleteOldImages, detecteUncofirmedUsers } from "./utils/crons.js"
import cors from 'cors'

export const initiate_app = (app, express) => {
    const port = +process.env.PORT

    app.use(express.json())
    app.use(cors())
    db_connection()

    app.use("/auth", routers.authRouter)
    app.use("/article", routers.articleRouter)
    app.use("/form", routers.formRouter)
    app.use("/application", routers.applicationRouter)
    app.use("/user", routers.userRouter)
    
    app.use("*", (req, res) => res.status(404).send("Page not found"))
    app.use(globalResponse)

    DeleteOldImages()
    detecteUncofirmedUsers()

    app.listen(port, () => console.log(`Server is running on port ${port}`))

}