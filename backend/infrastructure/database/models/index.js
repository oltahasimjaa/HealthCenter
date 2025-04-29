const sequelize = require('../../../config/database');

// Import models
const Role = require('./MySQL/Role');
const Country = require('./MySQL/Country');
const City = require('./MySQL/City');
const ProfileImage = require('./MySQL/ProfileImage');
const DashboardRole = require('./MySQL/DashboardRole');
const User = require('./MySQL/User');


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

module.exports = {
  sequelize,
  Role: RoleModel,
  Country: CountryModel,
  City: CityModel,
  ProfileImage: ProfileImageModel,
  DashboardRole: DashboardRoleModel,
  User: UserModel,
};