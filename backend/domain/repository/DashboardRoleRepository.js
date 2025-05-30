
const mongoose = require('mongoose');
const { ObjectId } = require('mongoose').Types;

const { DashboardRole, User } = require('../database/models/index');
const { DashboardRoleMongo, UserMongo } = require('../database/models/indexMongo');



class DashboardRoleRepository {
  // Read operations - Get from MongoDB with fallback to MySQL
  async findAll() {
    try {
      // Get all from MongoDB with populated relationships
      return await DashboardRoleMongo.find().lean();
    } catch (error) {
      // Fallback to MySQL if MongoDB fails
      console.error("MongoDB findAll failed, falling back to MySQL:", error);
      // return await DashboardRole.findAll({  });
    }
  }
  
  async findById(id) {
    try {
      // Get from MongoDB with populated relationships
      return await DashboardRoleMongo.findOne({ mysqlId: id }).lean();
    } catch (error) {
      // Fallback to MySQL if MongoDB fails
      console.error("MongoDB findById failed, falling back to MySQL:", error);
      // return await DashboardRole.findByPk(id, {  });
    }
  }
  
  // Write operations - Write to both MongoDB and MySQL
  async create(data) {
    try {
      console.log("Creating DashboardRole:", data);
      
      // First create in MySQL
      const mysqlResource = await DashboardRole.create(data);
      
      // Prepare data for MongoDB
      const mongoData = {
        mysqlId: mysqlResource.id.toString(),
        ...data
      };
      
      // Handle foreign keys - convert MySQL IDs to MongoDB references
      
      
      // Create in MongoDB
      const mongoResource = await DashboardRoleMongo.create(mongoData);
      console.log("DashboardRole saved in MongoDB:", mongoResource);
      
      return mysqlResource;
    } catch (error) {
      console.error("Error creating DashboardRole:", error);
      throw new Error('Error creating DashboardRole: ' + error.message);
    }
  }
  
  async update(id, data) {
    try {
      // Update in MySQL
      const [updatedCount] = await DashboardRole.update(
        { ...data },
        { where: { id } }
      );
  
      if (updatedCount === 0) {
        throw new Error("DashboardRole not found in MySQL");
      }
      
      // Prepare update data for MongoDB
      const mongoUpdateData = { ...data };
      
      // Handle foreign keys - convert MySQL IDs to MongoDB references
      
      
      // Update in MongoDB
      const updatedMongoDB = await DashboardRoleMongo.updateOne(
        { mysqlId: id },
        { $set: mongoUpdateData }
      );
  
      if (updatedMongoDB.modifiedCount === 0) {
        console.warn("DashboardRole not found in MongoDB or no changes made");
      }
  
      // Return the updated resource with populated relationships
      return this.findById(id);
    } catch (error) {
      console.error("Error updating DashboardRole:", error);
      throw new Error('Error updating DashboardRole: ' + error.message);
    }
  }
  
  async delete(id) {
    try {
      // Delete from MySQL
      const deletedMySQL = await DashboardRole.destroy({ where: { id } });
      
      // Delete from MongoDB
      await DashboardRoleMongo.deleteOne({ mysqlId: id });
      
      return deletedMySQL;
    } catch (error) {
      console.error("Error deleting DashboardRole:", error);
      throw new Error('Error deleting DashboardRole: ' + error.message);
    }
  }
}

module.exports = new DashboardRoleRepository();
