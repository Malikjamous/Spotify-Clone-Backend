import { IBaseModel, IModel } from './models.types';

export interface IFavoriteSong extends IBaseModel<IFavoriteSong> {
    songId: number;
    userId: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface IFavoriteSongModel extends IModel<IFavoriteSong> { }

module.exports = (sequelize, dataTypes) => {
    const favoriteSong = sequelize.define(
        'favoriteSong',
        {
            userId: {
                type: dataTypes.INTEGER,
                allowNull: false,
            },
            songId: {
                type: dataTypes.INTEGER,
                allowNull: false,
            },

        },
        {
            tableName: 'favoriteSong',
        }
    );

    return favoriteSong;
};
