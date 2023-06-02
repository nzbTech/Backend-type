const mongoose = require('mongoose')
const models = require('../models/models')


const convertToNumber = value => {
    const number = Number(value);
    return isNaN(number) ? null : number
}
  
const parseCategories = value => {
    return value.split(',')
}

const CATEGORY_MAP = {
    1: 'Smartphone',
    2: 'Laptop',
    3: 'TV'
}
  
const mapCategoryNumberToName = (categoryNumber) => {
    return CATEGORY_MAP[categoryNumber] || null
}
  
const FILTER_MAP = {
    minPrice: { 
      key: 'price', 
      operator: '$gte', 
      transform: convertToNumber 
    },
    maxPrice: { 
      key: 'price', 
      operator: '$lte', 
      transform: convertToNumber 
    },
    category: { 
      key: 'category', 
      operator: '$eq',
      transform: mapCategoryNumberToName 
    },
    excludedCategory: { 
      key: 'category', 
      operator: '$ne'
    },
    categories: { 
      key: 'category', 
      operator: '$in', 
      transform: parseCategories 
    },
    sortByPrice: {
        key: 'sort',
        transform: (value) => {
            if (value === 'desc') {
                return { price: -1 };
            } else if (value === 'asc') {
                return { price: 1 };
            } else {
                return null;
            }
        }
    }
}

const getfilter = (req) => {
    const filter = {}
    let sort = {}
    for (const [queryParam, filterConfig] of Object.entries(FILTER_MAP)) {
      const queryValue = req.query[queryParam]
      if (!queryValue) continue

      if (filterConfig.key === 'sort') {
        sort = filterConfig.transform(queryValue)
        continue
      }
  
      const filterKey = filterConfig.key
      const filterValue = filterConfig.transform ? filterConfig.transform(queryValue) : queryValue
      const filterOperator = filterConfig.operator
  
      if (!filter[filterKey]) filter[filterKey] = {}
      filter[filterKey][filterOperator] = filterValue
    }
    return { filter, sort }
}

module.exports = { getfilter }