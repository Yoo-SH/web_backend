const express = require('express');
const mongodb = require('mongodb');

const db = require('../data/database');

const ObjectId = mongodb.ObjectId; //objectID 생성자 함수를 가져옴. 인스턴스화할 수 있는 클래스 함수를 이용해서 MongoDB의 _id를 생성할 수 있음.

const router = express.Router();

router.get('/', function(req, res) {
  res.redirect('/posts');
});

router.get('/posts', function(req, res) {
  const posts = db.getDb().collection('posts').find().toArray();
  res.render('posts-list', {posts: posts});
});

router.get('/new-post', async function(req, res) {
  const authors = await db.getDb().collection('authors').find().toArray();
  res.render('create-post', {authors: authors});
});

router.post('/posts', async function(req, res) { 
  
  const authorID = new ObjectId (req.body.author);
  console.log(authorID);

  const author = await db.getDb().collection('authors').findOne({_id: authorID});

  const newPost = { // form에서 받아온 데이터를 객체로 만들어서 저장
    title: req.body.title,
    content: req.body.content,
    summary: req.body.summary,
    body: req.body.content,
    date: new Date(), 
    author :{
      id: authorID,
      name: author,
      email : author.email

    }
  }

  const result = await db.getDb().collection('posts').insertOne(newPost); //이 갹체는 몽고 DB 패키지에 의해 데이터베이스에 문서로 삽입됨
  console.log(result);
  res.redirect('/posts');
});

module.exports = router;