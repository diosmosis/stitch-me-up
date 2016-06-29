'use strict'

const path = require('path')
const exec = require('co-exec')
const expect = require('chai').expect

const TEST_CACHE_DIR = path.join(__dirname, '../resources/test-cache-dir')
const TEST_MICROSERVICES_DIR = path.join(__dirname, '../resources/test-microservices')
const ROOT_MICROSERVICE_DIR = path.join(TEST_MICROSERVICES_DIR, 'microserviceRoot')
const LOCAL_MICROSERVICE_D = path.join(TEST_MICROSERVICES_DIR, 'microserviceD')
const STITCH_BIN = path.join(__dirname, '../../bin/stitch')

describe('local-checkout-workflow', function () {
  this.timeout(120 * 1000)

  before(function * () {
    try {
      yield exec(`rm -r "${TEST_CACHE_DIR}"`)
    } catch (e) {
      // ignore
    }
  })

  it('should link to local code if --link is used, but clone other repos', function () {
    const cmd = `${STITCH_BIN} --with=microserviceA --link "${LOCAL_MICROSERVICE_D}"`
    const env = Object.assign({}, process.env, { STITCH_REGISTRY: REGISTRY_URL })
    const urls = yield launchUtils.launch(cmd, { cwd: ROOT_MICROSERVICE_DIR, env: env })

    const apiResponses = yield launchUtils.queryApis(urls)
    expect(apiResponses).to.deep.equal({
      j: 2
    })
  })
})
