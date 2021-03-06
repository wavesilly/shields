'use strict'

const Joi = require('joi')
const categories = require('../../services/categories')

const isRealCategory = Joi.equal(categories.map(({ id }) => id)).required()

const isValidCategory = Joi.alternatives()
  .try(isRealCategory, Joi.equal('debug', 'dynamic').required())
  .required()

function assertValidCategory(category, message = undefined) {
  Joi.assert(category, isValidCategory, message)
}

module.exports = {
  isValidCategory,
  assertValidCategory,
}
