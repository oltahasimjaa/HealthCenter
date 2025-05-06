const UserMongo = require('./Mongo/UserMongo');
const RoleMongo = require('./Mongo/RoleMongo');
const DashboardRoleMongo = require('./Mongo/DashboardRoleMongo');
const CountryMongo = require('./Mongo/CountryMongo');
const CityMongo = require('./Mongo/CityMongo');
const ProfileImageMongo = require('./Mongo/ProfileImageMongo');
const UserProgramsMongo = require('./Mongo/UserProgramsMongo');
const ProgramMongo = require('./Mongo/ProgramMongo');
const ListMongo = require('./Mongo/ListMongo');
const CardMongo = require('./Mongo/CardMongo');

module.exports = {
  UserMongo,
  ProgramMongo,
  UserProgramsMongo,
  CountryMongo,
  DashboardRoleMongo,
  CityMongo,
  ProfileImageMongo,
  ListMongo,
  RoleMongo,
  CardMongo
};