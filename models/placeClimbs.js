'use strict';
const { DataTypes } = require('sequelize');
const PlaceClimbs = require('../classes/placeClimbs');

const Place = require('../classes/place');
const Climb = require('../classes/climb');

module.exports = sequelize => {
    PlaceClimbs.init(
        {
            placeId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: Place,
                    key: 'id',
                    as: 'place_id'
                },
                onDelete: 'CASCADE'
            },
            climbId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: Climb,
                    key: 'id',
                    as: 'climb_id'
                }
            }
        },
        {
            sequelize,
            timestamps: false,
            underscored: true
        }
    );

    PlaceClimbs.removeAttribute('id');

    return PlaceClimbs;
};
