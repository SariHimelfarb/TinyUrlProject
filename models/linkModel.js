import mongoose from "mongoose";

const TargetValueSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    }
});

const LinkSchema = mongoose.Schema({

    originUrl: {
        type: String,
        default: ''
    },
    clicks: [
        {
            insertedAt: {
                type: Date,
                default: Date.now()
            },
            ipAddress: {
                type: String,
                default: "0.0.0.0"
            },
            targetParamValue: {
                type: String,
                required: false
            }        
        }
    ],
    targetParamName: {
        type: String,
        default: 't' 
    },
    targetValues: {
        type: [TargetValueSchema],
        default: [
            { name: "Facebook", value: "fb" },
            { name: "Google", value: "gg" },
            { name: "Twitter", value: "tw" }
        ]
    }

})

export default mongoose.model("link", LinkSchema)