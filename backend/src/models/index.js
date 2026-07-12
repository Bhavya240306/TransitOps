// backend/src/models/index.js
//
// Auto-loads every *.js model file in this folder, initializes it against
// the shared Sequelize instance, then runs each model's .associate()
// function so relationships (hasMany/belongsTo) are wired up.
//
// IMPORTANT for the team: when you add a new model file (e.g. Vehicle.js,
// Driver.js), you do NOT need to edit this file. Just follow the same
// `module.exports = (sequelize, DataTypes) => {...}` pattern as User.js
// and it will be picked up automatically. This avoids merge conflicts
// since everyone is pushing to main every hour.

const fs = require('fs');
const path = require('path');
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const basename = path.basename(__filename);
const db = {};

fs.readdirSync(__dirname)
  .filter((file) => file !== basename && file.endsWith('.js'))
  .forEach((file) => {
    const modelDefiner = require(path.join(__dirname, file));
    const model = modelDefiner(sequelize, DataTypes);
    db[model.name] = model;
  });

// Wire up associations for any model that defines .associate()
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;

module.exports = db;
