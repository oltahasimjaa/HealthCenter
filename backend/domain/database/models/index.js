const sequelize = require('../../../config/database');

// Import models
const Role = require('./MySQL/Role');
const Country = require('./MySQL/Country');
const City = require('./MySQL/City');
const ProfileImage = require('./MySQL/ProfileImage');
const DashboardRole = require('./MySQL/DashboardRole');
const User = require('./MySQL/User');
const Program = require('./MySQL/Program');
const UserPrograms = require('./MySQL/UserPrograms');
const List = require('./MySQL/List');
const CardModel = initializeModel(Card, sequelize);

// Initialize models - try to handle different patterns safely
function initializeModel(model, seq) {
  if (typeof model === 'function') {
    // If it's a function, call it with sequelize
    try {
      return model(seq);
    } catch (e) {
      // If calling as function fails, it might be a class
      if (e instanceof TypeError && e.message.includes('cannot be invoked without \'new\'')) {
        return model; // It's already initialized
      }
      throw e;
    }
  } else {
    // If it's not a function, return as is (already initialized)
    return model;
  }
}


const RoleModel = initializeModel(Role, sequelize);
const CountryModel = initializeModel(Country, sequelize);
const CityModel = initializeModel(City, sequelize);
const ProfileImageModel = initializeModel(ProfileImage, sequelize);
const DashboardRoleModel = initializeModel(DashboardRole, sequelize);
const UserModel = initializeModel(User, sequelize);
const ProgramModel = initializeModel(Program, sequelize);
const UserProgramsModel = initializeModel(UserPrograms, sequelize);
const ListModel = initializeModel(List, sequelize);




// User relationships
RoleModel.hasMany(UserModel, { foreignKey: 'roleId' });
UserModel.belongsTo(RoleModel, { foreignKey: 'roleId' });

DashboardRoleModel.hasMany(UserModel, { foreignKey: 'dashboardRoleId' });
UserModel.belongsTo(DashboardRoleModel, { foreignKey: 'dashboardRoleId' });

CountryModel.hasMany(UserModel, { foreignKey: 'countryId' });
UserModel.belongsTo(CountryModel, { foreignKey: 'countryId' });

CityModel.hasMany(UserModel, { foreignKey: 'cityId' });
UserModel.belongsTo(CityModel, { foreignKey: 'cityId' });

ProfileImageModel.hasMany(UserModel, { foreignKey: 'profileImageId' });
UserModel.belongsTo(ProfileImageModel, { foreignKey: 'profileImageId' });

UserModel.belongsToMany(ProgramModel, { through: UserProgramsModel, foreignKey: 'userId' });
ProgramModel.belongsToMany(UserModel, { through: UserProgramsModel, foreignKey: 'programId' });

UserModel.hasMany(ListModel, { foreignKey: 'createdById' });
ListModel.belongsTo(UserModel, { foreignKey: 'createdById' });
// List and Card relationships
ListModel.hasMany(CardModel, { foreignKey: 'listId', onDelete: 'CASCADE' });
CardModel.belongsTo(ListModel, { foreignKey: 'listId' });

module.exports = {
  sequelize,
  Role: RoleModel,
  Country: CountryModel,
  City: CityModel,
  ProfileImage: ProfileImageModel,
  Program: ProgramModel,
  DashboardRole: DashboardRoleModel,
  User: UserModel,
  UserPrograms: UserProgramsModel,
  List: ListModel,
};