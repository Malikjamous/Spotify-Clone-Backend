import { IBaseModel, IModel } from './models.types';

export interface IUser extends IBaseModel<IUser> {
  userId: number;
  email: string;
  password: string;
  userRole: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserModel extends IModel<IUser> { }

module.exports = (sequelize, dataTypes) => {
  const user = sequelize.define(
    'user',
    {
      userId: {
        type: dataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      email: { type: dataTypes.STRING, allowNull: false, trim: true },
      password: { type: dataTypes.STRING, allowNull: false },
      userRole: { type: dataTypes.STRING, allowNull: false }
    },
    {
      tableName: 'user',
    }
  );

  user.associate = (models: any) => {
    user.hasMany(models.artist, { foreignKey: 'userId' });
  };

  return user;
};
