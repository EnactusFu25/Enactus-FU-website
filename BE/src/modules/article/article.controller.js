import Article from '../../../DB/models/article.model.js'  
import cloudinaryConnection from '../../utils/cloudinary.js'
import generateUniqueString from "../../utils/generate-Unique-String.js";

export const getArticles = async (req, res) => {
    const articles = await Article.find({isDeleted: false, approved: true})
    if (!articles.length)
        return res.status(404).json({message: "no articles found"})
    res.status(200).json({articles})
}

export const getArticle = async (req, res) => {
    const { id } = req.params
    const article = await Article.findById(id)
    if (!article || article.isDeleted || !article.approved) 
        return res.status(404).json({message: "article not found"})
    res.status(200).json({article})
}

export const createArticle = async (req, res) => {
    const { title, content } = req.body
    if (!req.file) return next({ message: 'Please upload the article image', cause: 400 })

    const folderId = generateUniqueString(4)
    const { secure_url, public_id } = await cloudinaryConnection().uploader.upload(req.file.path, {
        folder: `${process.env.MAIN_FOLDER}/articles/${folderId}`,
    })
    const Image = { secure_url, public_id }
    const article = new Article({title, content, Image, uploadedBy: req.AuthUser._id})
    await article.save()
    res.status(201).json({message: "article created", article})
}

export const updateArticle = async (req, res) =>
{
    const { id } = req.params
    const { title, content} = req.body
    const article = await Article.findById(id)
    if (title) article.title = title
    if (content) article.content = content
    article.updatedAt = Date.now()
    article = await article.save()
    if (!article)
        return res.status(404).json({message: "article not found"})
    res.status(200).json({message: "article updated", article})
}

export const deleteArticle = async (req, res) => {
    const { id } = req.params
    const article = await Article.findByIdAndUpdate(id, {isDeleted: true, deletedAt: Date.now()})
    if (!article)
        return res.status(404).json({message: "article not found", success: false})
    res.status(200).json({message: "article deleted", success: true})
}