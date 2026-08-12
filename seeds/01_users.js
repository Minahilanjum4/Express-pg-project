/**
 * @param { import("knex").Knex } knex
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries (posts cascade-deletes because of FK)
  await knex('users').del();

  await knex('users').insert([
    { id: 1, name: 'Ayesha Khan', email: 'ayesha@example.com' },
    { id: 2, name: 'Bilal Ahmed', email: 'bilal@example.com' },
    { id: 3, name: 'Sara Malik', email: 'sara@example.com' }
  ]);
};
