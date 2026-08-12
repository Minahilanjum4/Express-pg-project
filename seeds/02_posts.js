/**
 * @param { import("knex").Knex } knex
 */
exports.seed = async function (knex) {
  await knex('posts').del();

  await knex('posts').insert([
    {
      title: 'Getting Started with Express',
      body: 'Express is a minimal and flexible Node.js web application framework.',
      user_id: 1
    },
    {
      title: 'Why PostgreSQL?',
      body: 'PostgreSQL is a powerful, open source object-relational database system.',
      user_id: 1
    },
    {
      title: 'Understanding Migrations',
      body: 'Migrations let you version-control your database schema over time.',
      user_id: 2
    },
    {
      title: 'REST API Best Practices',
      body: 'Use proper status codes, versioning, and consistent naming conventions.',
      user_id: 3
    }
  ]);
};
