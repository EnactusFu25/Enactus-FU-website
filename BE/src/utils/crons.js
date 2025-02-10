import { scheduleJob } from "node-schedule"
import { DateTime } from "luxon"

import Article from "../DB/models/article.model.js"
import User from "../DB/models/user.model.js"

export function DeleteOldImages()
{
    scheduleJob("0 0 * * *", async () =>
    {
        
        const articles = await Article.find({isDeleted: true, imagesDeleted: false})
        for (const article of articles)
        {
            if (DateTime.fromISO(article.deletedAt) > DateTime.now().minus({days: 30}))
                continue;
            const { folderId } = article
            const folderPath = article.Image.public_id.split(`${folderId}/`)[0] + folderId
            await cloudinaryConnection().api.delete_resources_by_prefix(folderPath)
            await cloudinaryConnection().api.delete_folder(folderPath)
            article.imagesDeleted = true
            await article.save()
        }
    })
}

export function detecteUncofirmedUsers()
{
    scheduleJob("0 0 * * *", async () => {
        const users = await User.find({verifiedEmail: false})
        for (const user of users)
        {
            if (DateTime.fromISO(user.createdAt) < DateTime.now().minus({days: 7}))
            {
                user.isEmailVerified = true
                await user.save()
            }
        }
    })
}