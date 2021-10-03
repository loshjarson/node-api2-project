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
        res.status(500).json({
          message: "The posts information could not be retrieved",
        });
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
            res.status(500).json({
              message: "The post information could not be retrieved",
            });
          });
})



  module.exports = router