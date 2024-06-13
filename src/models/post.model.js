import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const postSchema = new Schema(
    {
        image: {
            type: String, //cloudinary url
            
        },
        textfield: {
            type: String, 
            required: true
        },
        hashtags: {
            type: Array,
        },
        views: {
            type: Number,
            default: 0
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }

    }, 
    {
        timestamps: true
    }
)

postSchema.plugin(mongooseAggregatePaginate)

export const Post = mongoose.model("Post", postSchema)