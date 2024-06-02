import linkModel from "../models/linkModel.js";
import userModel from "../models/userModel.js";

const LinkController = {

    getList: async (req, res) => {
        try {
            const links = await linkModel.find()
            res.json({ links })
        }
        catch (e) {
            res.status(400).json({ massage: e.massage })
        }
    },

    getById: async (req, res) => {
        try {
            const link = await linkModel.findById(req.params.id)
            if(!link){
                res.status(400).json({message:'link not found'})
            }
            link.clicks.push({ipAddress:req.ip})
            await link.save()
            res.redirect(link.originUrl)
        }
        catch (e) {
            res.status(400).json({ massage: e.massage })
        }
    },

    getClickState: async (req, res) => {
        try {
            const link = await linkModel.findById(req.params.id)
            if(!link){
                res.status(400).json({message:'link not found'})
            }

            const targetValueMap = link.targetValues.reduce((acc,target)=>{
                acc[target.value]=target.name
                return acc;
            },{})

            const clickData = link.clicks.reduce((acc,click)=>{
                const targetValue = click.targetParamValue || 'unknown'
                const targetName = targetValueMap[targetValue] || 'unknown'
                acc[targetName] = (acc[targetName] || 0) + 1
                return acc
            },{})

            res.json(clickData)
        }
        catch (e) {
            res.status(500).json({ massage: e.massage })
        }
    },

    add: async (req, res) => {
        const { originUrl, userId } = req.body
        //אם לא קיבל את כל הפרמטרים
        if(!originUrl || !userId){
            return res.status(400).json({message:'missing url or userId'})
        }
        try {
            // המתן לחיפוש המשתמש
            const user = await userModel.findById(userId).populate('links');

            if(!user){
                return res.status(400).json({message:'user not found'})
            }


            const existUrl = user.links.find(link=>link.originUrl==originUrl)

            if(existUrl){
                return res.json(`http://localhost:3000/links/${existUrl._id}`)
            }

            const newLink = await linkModel.create({originUrl})
            user.links.push(newLink)
            await user.save()

            const shortUrl = `${req.protocol}://${req.get('host')}/links/${newLink._id}`
            return res.json(shortUrl)
        }
        catch (e) {
            res.status(400).json({ message: e.massage })
        }
    },


    update: async (req, res) => {
        const { id } = req.params
        try {
            const updateLink = await linkModel.findByIdAndUpdate(id, req.bode, {
                new: true
            })
            res.json({ updateLink })
        }
        catch (e) {
            res.status(400).json({ massage: e.massage })
        }
    },

    delete: async (req, res) => {
        const { id } = req.params
        try {
            const deleteLink = await linkModel.findByIdAndDelete(id)
            res.json({ deleteLink })
        }
        catch (e) {
            res.status(400).json({ massage: e.massage })
        }
    }
}

export default LinkController