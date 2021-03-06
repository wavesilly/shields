'use strict'

const Joi = require('joi')
const {
  isVPlusDottedVersionNClausesWithOptionalSuffix,
} = require('../test-validators')
const t = (module.exports = require('../tester').createServiceTester())

t.create('version')
  .get('/asciidoctor/maven/asciidoctorj.json')
  .expectJSONTypes(
    Joi.object().keys({
      name: 'bintray',
      value: isVPlusDottedVersionNClausesWithOptionalSuffix,
    })
  )

t.create('version (not found)')
  .get('/asciidoctor/maven/not-a-real-package.json')
  .expectJSONTypes(
    Joi.object().keys({
      name: 'bintray',
      value: 'not found',
    })
  )

t.create('version (mocked)')
  .get('/asciidoctor/maven/asciidoctorj.json?style=_shields_test')
  .intercept(nock =>
    nock('https://bintray.com')
      .get('/api/v1/packages/asciidoctor/maven/asciidoctorj/versions/_latest')
      .reply(200, {
        name: '1.5.7',
      })
  )
  .expectJSON({
    name: 'bintray',
    value: 'v1.5.7',
    color: 'blue',
  })
