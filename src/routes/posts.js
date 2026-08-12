const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: Getting Started with Express
 *         body:
 *           type: string
 *           example: Express is a minimal and flexible Node.js web framework.
 *         user_id:
 *           type: integer
 *           example: 1
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *     PostInput:
 *       type: object
 *       required:
 *         - title
 *         - body
 *         - user_id
 *       properties:
 *         title:
 *           type: string
 *         body:
 *           type: string
 *         user_id:
 *           type: integer
 */

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Post management (belongs to a User)
 */

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Get all posts (with author info)
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: List of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 */
router.get('/', async (req, res) => {
  try {
    const posts = await db('posts')
      .join('users', 'posts.user_id', 'users.id')
      .select(
        'posts.id',
        'posts.title',
        'posts.body',
        'posts.user_id',
        'users.name as author_name',
        'posts.created_at',
        'posts.updated_at'
      )
      .orderBy('posts.id');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     summary: Get a single post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Post found
 *       404:
 *         description: Post not found
 */
router.get('/:id', async (req, res) => {
  try {
    const post = await db('posts').where({ id: req.params.id }).first();
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostInput'
 *     responses:
 *       201:
 *         description: Post created
 *       400:
 *         description: Validation error
 */
router.post('/', async (req, res) => {
  try {
    const { title, body, user_id } = req.body;
    if (!title || !body || !user_id) {
      return res.status(400).json({ error: 'title, body and user_id are required' });
    }
    const userExists = await db('users').where({ id: user_id }).first();
    if (!userExists) {
      return res.status(400).json({ error: `user_id ${user_id} does not exist` });
    }
    const [post] = await db('posts').insert({ title, body, user_id }).returning('*');
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/posts/{id}:
 *   put:
 *     summary: Update a post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostInput'
 *     responses:
 *       200:
 *         description: Post updated
 *       404:
 *         description: Post not found
 */
router.put('/:id', async (req, res) => {
  try {
    const { title, body, user_id } = req.body;
    const [post] = await db('posts')
      .where({ id: req.params.id })
      .update({ title, body, user_id, updated_at: db.fn.now() })
      .returning('*');
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: Delete a post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Post deleted
 *       404:
 *         description: Post not found
 */
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await db('posts').where({ id: req.params.id }).del();
    if (!deleted) return res.status(404).json({ error: 'Post not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
