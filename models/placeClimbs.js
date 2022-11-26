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
                field: 'place_id',
                references: {
                    model: Place,
                    key: 'id',
                    as: 'place_id'
                }
            },
            climbId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                field: 'climb_id',
                references: {
                    model: Climb,
                    key: 'id',
                    as: 'climb_id'
                }
            }
        }
    );

    return PlaceClimbs;
};
