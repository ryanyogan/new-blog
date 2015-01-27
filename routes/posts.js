/**
 * API Router File
 */

var Post    = require('../models/post');
var express = require('express');
var Router  = express.Router();

/**
 * TODO: DELETE ME!  This is bs fixture data
 */

var posts = [
  {
    "title": "A donkey ran",
    "content": "I don't think this requires an explinataion"
  },{
    "title": "I will ditch mongo",
    "content": "I think I prefer the old blog just being markdown"
  }
];

Post.find(function(err, posts) {
  if (posts && posts.length === 0) {
    posts.forEach(function(post) {
      new Post(post).save();
    });
  }
});

/**
 * FIXME: End of crap to delete
 */

Router.route('/posts')
  .get(function(req, res) {
    Post.find(function(err, posts) {
      if (err) return res.send(err);
      res.json(posts);
    });
  });

  .post(function(req, res) {
    var post = new Post(req.body);
    post.save(function(err) {
      if (err) return res.send(err);
      res.send({message: 'Post Added' });
    });
  });

Router.route('/posts/:id')
  .put(function(req, res) {
    Post.findByOne({_id : req.params.id}).exec(function(err, post) {
      if (err) return res.send(err);

      for (prop in req.body) {
        post[prop] = req.body[prop];
      }

      post.save(function(err) {
        if (err) return res.send(err);
        res.json({ message: 'Post updated.' });
      });
    });
  });

  .get(function(req, res) {
    Post.findByOne({_id : req.params.id}).exec(function(err, post) {
      if (err) return res.send(err);
      res.send(post);
    });
  })

  .delete(function(req, res) {
    Post.remove({
      _id: req.params.id
    }, function(err, post) {
      if (err) res.send(err);
      res.json({ message: 'Successfully delete' });
    });
  });

module.exports = Router;
