import { IBaseModel, IModel } from './models.types';

export interface ISong extends IBaseModel<ISong> {
  songId: number;
  name: string;
  duration: string;
  index: number;
  isFavorite: boolean;
  albumId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISongModel extends IModel<ISong> { }

module.exports = (sequelize, dataTypes) => {
  const song = sequelize.define(
    'song',
    {
      songId: {
        type: dataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: { type: dataTypes.STRING, allowNull: false, trim: true },
      duration: { type: dataTypes.STRING, allowNull: false },
      index: { type: dataTypes.INTEGER, allowNull: false },
      isFavorite: { type: dataTypes.BOOLEAN, allowNull: false },
    },
    {
      tableName: 'song',
    }
  );

  song.associate = (models: any) => {
    song.belongsTo(models.artist, { foreignKey: 'artistId' });
    song.belongsTo(models.album, { foreignKey: 'albumId' });
    song.hasMany(models.favoriteSong, { foreignKey: 'songId' });
    song.belongsTo(models.user, { foreignKey: 'userId' });
  };

  return song;
};
