import { IBaseModel, IModel } from './models.types';
export interface IArtist extends IBaseModel<IArtist> {
  artistId: number;
  name: string;
  description: string;
  genre: string;
  activeDate: Date;
  dissolvedDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IArtistModel extends IModel<IArtist> { }

module.exports = (sequelize, dataTypes) => {
  const artist = sequelize.define(
    'artist',
    {
      artistId: {
        type: dataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: { type: dataTypes.STRING, allowNull: false, trim: true },
      description: { type: dataTypes.STRING, allowNull: false, trim: true },
      genre: { type: dataTypes.STRING, allowNull: false },
      activeDate: { type: dataTypes.DATE, allowNull: false },
      dissolvedDate: { type: dataTypes.DATE },
      isActive: { type: dataTypes.BOOLEAN, allowNull: false },
    },
    {
      tableName: 'artist',
    }
  );

  artist.associate = (models: any) => {
    artist.hasMany(models.album, { foreignKey: 'artistId' });
    artist.hasMany(models.song, { foreignKey: 'artistId' });
    artist.belongsTo(models.user, { foreignKey: 'userId' });
  };

  return artist;
};
