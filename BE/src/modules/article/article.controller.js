import Article from '../../../DB/models/article.model.js'  

export const getArticles = async (req, res) => {
    const articles = await Article.find()
    if (!articles.length)
        return res.status(404).json({message: "no articles found"})
    res.status(200).json({articles})
}

export const getArticle = async (req, res) => {
    const { id } = req.params
    const article = await Article.findById(id)
    if (!article)
        return res.status(404).json({message: "article not found"})
    res.status(200).json({article})
}

export const createArticle = async (req, res) => {
    const { title, content } = req.body
    // handle media
    const article = new Article({title, content})
    await article.save()
    res.status(201).json({message: "article created"})
}

export const updateArticle = async (req, res) =>
{
    const { id } = req.params
    const { title, content } = req.body
    // handle media
    const article = await Article.findByIdAndUpdate(id, {title, content})
    if (!article)
        return res.status(404).json({message: "article not found"})
    res.status(200).json({message: "article updated"})
}

export const deleteArticle = async (req, res) => {
    const { id } = req.params
    const article = await Article.findByIdAndUpdate(id, {isDeleted: true, deletedAt: Date.now()})
    // handle media
    if (!article)
        return res.status(404).json({message: "article not found"})
    res.status(200).json({message: "article deleted"})
}