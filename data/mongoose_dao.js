const mongoose = require("mongoose");
// encode url here for now: azure cosmos db
const url = process.env.MONGO_CONN_STR;

// encode credentials here for now
const connectionParameters = {
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PASSWD,
    useNewUrlParser: true
};

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

// connect to database
const conn = mongoose.createConnection(url, connectionParameters);

const PostModel = conn.model('post', PostSchema);

// create new post
module.exports.newPost = (postStruct, callback) => {
    let post = new PostModel();
    post.postid = postStruct.postid;
    post.title = postStruct.title;
    post.author = postStruct.author;
    post.time = postStruct.time;
    post.img = postStruct.img;
    post.desc = postStruct.desc;
    post.save((err) => {
        if (err) {
            console.log("error creating post:" + err);
            conn.close();
            callback(err);
        } else {
            console.log("new post created");
            conn.close();
            callback(null);
        }
    });
    
}

// find a post
module.exports.getPost = (postId, callback) => {
    var id = postId;
    PostModel.findOne({postid: id}, {}, {lean: true}, (err, res) => {
        if (!err) {
            console.log(`entry found: ${postId}`);
            conn.close();
            callback(err, res);
        } else {
            conn.close();
            callback(err, res);
        }
    });
}

// list all posts
module.exports.getAllPosts = (callback) => {
    PostModel.find({}, {}, {sort: {time: -1}, lean: true}, (err, res) => {
        if (!err) {
            console.log("getting all entries");
            conn.close();
            callback(err, res);
        } else {
            conn.close();
            callback(err, res);
        }
    });
}

// delete a post
module.exports.delPost = (postId, callback) => {
    var id = postId;
    PostModel.findOneAndRemove({postid: id}, (err) => {
        if (!err) {
            console.log(`entry deleted: ${postId}`);
            conn.close();
            callback(null);
        } else {
            conn.close();
            callback(err);
        }
    });
}