'use strict'
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      let favoriteSongs;
      await queryInterface.sequelize.query('SELECT * FROM `song` WHERE isFavorite = true', { type: queryInterface.sequelize.QueryTypes.SELECT }).then((result) => {
        favoriteSongs = result;
      });
      await queryInterface.createTable('favoriteSong', {
        songId: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false
        },
        userId: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false
        }
      }, { transaction });
      await queryInterface.bulkInsert('favoriteSong', favoriteSongs.map((favSong) => {
        return {
          userId: favSong.userId,
          songId: favSong.songId
        }
      }))
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      let favoritesSongInFavoritesTable;
      await queryInterface.sequelize.query('SELECT * FROM `favoriteSong`', { type: queryInterface.sequelize.QueryTypes.SELECT }).then((result) => {
        favoritesSongInFavoritesTable = result;
        console.log(result, 'result');
      })
      favoritesSongInFavoritesTable.map((favSong) => {
        queryInterface.sequelize.query('UPDATE `song` SET isFavorite = true WHERE songId = favSong.songId').then(([results, metadata]) => {
          console.log(results, 'results');
          console.log(metadata, 'metadata');
        });
      }, { transaction })
      await queryInterface.dropTable('favoriteSong', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
}