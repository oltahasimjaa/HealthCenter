const UserMongo = require('./Mongo/UserMongo');
const RoleMongo = require('./Mongo/RoleMongo');
const DashboardRoleMongo = require('./Mongo/DashboardRoleMongo');
const CountryMongo = require('./Mongo/CountryMongo');
const CityMongo = require('./Mongo/CityMongo');
const ProfileImageMongo = require('./Mongo/ProfileImageMongo');




module.exports = {
  UserMongo,
  CountryMongo,
  DashboardRoleMongo,
  CityMongo,
  ProfileImageMongo,
  RoleMongo
};