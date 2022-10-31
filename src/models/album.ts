import { IBaseModel, IModel } from './models.types';
export interface IAlbum extends IBaseModel<IAlbum> {
  albumId: number;
  name: string;
  description: string;
  date: Date;
  artistId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAlbumModel extends IModel<IAlbum> { }

module.exports = (sequelize, dataTypes) => {
  const album = sequelize.define(
    'album',
    {
      albumId: {
        type: dataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: { type: dataTypes.STRING, allowNull: false, trim: true },
      description: { type: dataTypes.TEXT, allowNull: false, trim: true },
      date: { type: dataTypes.DATE, allowNull: false },
    },
    {
      tableName: 'album',
    }
  );

  album.associate = (models: any) => {
    album.belongsTo(models.artist, { foreignKey: 'artistId' });
    album.hasMany(models.song, { foreignKey: 'albumId' });
    album.belongsTo(models.user, { foreignKey: 'userId' });
  };

  return album;
};
