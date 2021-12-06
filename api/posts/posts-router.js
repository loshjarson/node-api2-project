// implement your posts router here
const Post = require('./posts-model');
const express = require("express")
const router = express.Router()


router.get('/', (req, res) => {
    Post.find()
      .then(posts => {
        res.status(200).json(posts);
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({ message: "The posts information could not be retrieved" });
      });
});

router.get('/:id', (req,res) => {
    Post.findById(req.params.id)
        .then(post => {
            if (post) {
                res.status(200).json(post)
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist" })
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ message: "The post information could not be retrieved" });
          });
})

router.post('/', (req,res) => {
    const newPost = req.body
    if(!newPost.title || !newPost.contents){
        res.status(400).json({ message: "Please provide title and contents for the post" })
    }else{
        Post.insert(newPost)
        .then(postID=>{
            Post.findById(postID.id)
            .then(post => {
                res.status(201).json(post)
            })
            .catch(err => {
                res.status(500).json({ message: "There was an error while saving the post to the database" })
            })            
        })
        .catch(err=>{
            res.status(500).json({ message: "There was an error while saving the post to the database" })
        })
    }
})  

router.put('/:id',(req,res) => {
    const {id} = req.params;
    const changes = req.body;
    if(!changes.title || !changes.contents){
        res.status(400).json({ message: "Please provide title and contents for the post" })
    }else{
        Post.update(id,changes)
        .then( post => {
            if(!post){
            res.status(404).json({ message: "The post with the specified ID does not exist" })
            }else{
                Post.findById(id)
                .then(post => {
                res.status(201).json(post)
            })
            .catch(err => {
                res.status(500).json({ message: "There was an error while saving the post to the database" })
            }) 
            }
        }
        ).catch(err=> {
                res.status(500).json({ message: "The post information could not be modified" })
            })
    } 


})

router.delete('/:id', (req, res)=>{
    const {id} = req.params
    Post.findById(id)
        .then(post => {
            if (post) {
                Post.remove(id)
                    .then(posts => {
                        res.status(200).json(post)
                    })
                    .catch(err =>{
                        res.status(404).json({ message: "The post with the specified ID does not exist" })})
            
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist" })
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ message: "The post information could not be retrieved" });
          });
})

router.get('/:id/comments', (req, res) => {
    Post.findPostComments(req.params.id)
      .then(comments => {
        if (comments.length > 0) {
          res.status(200).json(comments);
        } 
        else {
          res.status(404).json({ message: "The post with the specified ID does not exist" });
        }
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({ message: "The comments information could not be retrieved" });
      });
  })
module.exports = router