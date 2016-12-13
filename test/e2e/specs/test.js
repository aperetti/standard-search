// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

module.exports = {
  'default e2e tests': function (browser) {
    browser
    .url('http://localhost:50000')
      .waitForElementVisible('#app', 5000)
      .setValue('#login-username', 'admin@test.com')
      .setValue('#login-password', 'test')
      .click('#sign-in')
      .waitForElementVisible('#landing', 1000)
      .click('#standard-menu-button')
      .waitForElementVisible('#standard-menu', 1000)
      .setValue('#search', 'A0101')
      .waitForElementVisible('#results-0', 5000)
      .pause(1000)
      .click('#results-0')
      .waitForElementVisible('#pdf', 5000)
      .click('#admin-dropdown')
      .waitForElementVisible('#edit-standard-button', 5000)
      .click('#edit-standard-button')
      .pause(1000)
      .getValue('#standard-code-input', function (result) {
        this.assert.equal(result.value, 'A0101')
      })
      .setValue('#standard-description-input', 'Updated Value')
      .end()
  }
}
