const mongoose = require("mongoose");
// encode url here for now
const url = "mongodb://ds062097.mlab.com:62097/tombusijieportfolio";

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const PostSchema = new Schema({
    post: ObjectId,
    postid: String,
    title: String,
    author: String,
    img: String,
    desc: String
});

// encode credentials here for now
const connectionParameters = {
    user: "tombusijieportfolio",
    pass: "tombusijieportfolio0001",
    useNewUrlParser: true
};

// connect to mlab
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
        if (!err) {
            console.log("new post created");
        } else {
            console.log(err);

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