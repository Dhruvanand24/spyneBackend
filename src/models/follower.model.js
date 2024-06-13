import mongoose, {Schema} from "mongoose"

const followerSchema = new Schema({
    follower: {
        type: Schema.Types.ObjectId, // one who is subscribing
        ref: "User"
    },
    user: {
        type: Schema.Types.ObjectId, // one to whom 'subscriber' is subscribing
        ref: "User"
    }
}, {timestamps: true})



export const Follower = mongoose.model("Follower", followerSchema)