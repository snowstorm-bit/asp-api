const { Places } = require('../database');

let SearchCriterias = {
    sortBy: '',
    orderBy: '',
    offset: '',
    limit: ''
};

module.exports.paginateResponse = (results, offset) => ({
    offset: offset,
    items: results
});

module.exports.searchClimbs = async (attributes = [], where = {}, searchCriterias: SearchCriterias) => {
    console.log(searchCriterias);
    let places = await Places.findAll({
        attributes: attributes,
        limit: searchCriterias.limit
    });
    return places;
};