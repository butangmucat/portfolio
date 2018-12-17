const mongoose = require("mongoose");
// encode url here for now: azure cosmos db
const url = "mongodb://cs376afinalfall18.documents.azure.com:10255/?ssl=true&replicaSet=globaldb";

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const PostSchema = new Schema({
    post: ObjectId,
    postid: String,
    title: String,
    author: String,
    time: Number,
    img: String,
    desc: String
});

// encode credentials here for now
const connectionParameters = {
    user: "cs376afinalfall18",
    pass: "vrUPQ3V8uHnbdigZTXlqXWBizmbD0vK9uYDo7Bwt0oC4VkDnBbZac8mrcpIApniAcdL8DAKjVcqem9j8LQ7mrA==",
    useNewUrlParser: true
};

// connect to database
const conn = mongoose.createConnection(url, connectionParameters);

const PostModel = conn.model('post', PostSchema);

// create new post
module.exports.newPost = (postStruct, callback) => {
    let post = new PostModel();
    post.postid = postStruct.postid;
    post.title = postStruct.title;
    post.author = postStruct.author;
    post.img = postStruct.img;
    post.desc = postStruct.desc;
    post.save((err, callback) => {
        if (err) {
            console.log("error creating post:" + err);
        } else {
            console.log("new post created");
        }
        conn.close();
        callback(null);
    });
    
}

// find a post
module.exports.getPost = (postId, callback) => {
    var id = postId;
    PostModel.findOne({ postid: id }).lean().exec((err, doc) => {
        if (!err) {
            console.log(`entry found: ${postId}`);
            conn.close();
            callback(err, doc);
        } else {
            conn.close();
            callback(err, doc);
        }
        conn.close();
    });
}