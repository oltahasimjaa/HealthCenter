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
const ScheduleMongo = require('./Mongo/ScheduleMongo');
const AppointmentMongo = require('./Mongo/AppointmentMongo');
const AttachmentMongo = require('./Mongo/AttachmentMongo');
const CardMemberMongo = require('./Mongo/CardMemberMongo');
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
   ScheduleMongo,
     AppointmentMongo,
  AttachmentMongo,
  CardMemberMongo,
  CardMongo
};