'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
var expect = chai.expect;

var LoginForm = function(){
  this.typeInField = function(field,value){
    return element(by.css('.login-form input[name='+field+']')).sendKeys(value);
  };
  this.submit = function(){
    return element(by.css('button')).submit();
  };
  this.isShowingInvalidLogin = function(){
    return element(by.css('.bad-login')).isDisplayed();
  };
  this.isShowingNotFound = function(){
    return element(by.css('.not-found')).isDisplayed();
  };
};

describe('Login view', function() {

  describe('when loaded', function() {
    before(function(){
      browser.get(browser.params.appUrl);
    });
    it('should have the correct page title', function() {
      expect(browser.getTitle()).to.eventually.equal('Login');
    });
  });

  describe('as a user who is registered with the SP', function() {
    var form;
    before(function(){
      browser.get(browser.params.appUrl);
      browser.sleep(1000);
      form = new LoginForm();
    });
    it('should allow me to login', function() {
      form.typeInField('username','robert@stormpath.com');
      form.typeInField('password','robert@stormpath.com');
      form.submit();
    });
    it('should take me to the service provider after login', function() {
      browser.sleep(2000);
      expect(browser.driver.getCurrentUrl()).to.eventually.have.string('https://stormpath.com');
    });
  });

  describe('as a user who is registered with the SP', function() {
    var form;
    before(function(){
      browser.get(browser.params.appUrl);
      browser.sleep(1000);
      form = new LoginForm();
    });
    it('should warn me if I entered the wrong login credentials', function() {
      form.typeInField('username','robert@stormpath.com');
      form.typeInField('password','1');
      form.submit();
      browser.sleep(1000);
      expect(form.isShowingInvalidLogin()).to.eventually.equal(true);
    });
  });

  describe('as a user who is not registered with the SP', function() {
    var form;
    before(function(){
      browser.get(browser.params.appUrl);
      browser.sleep(1000);
      form = new LoginForm();
    });
    it('should tell me that i ned to register if I try to login', function() {
      form.typeInField('username','1');
      form.typeInField('password','1');
      form.submit();
      browser.sleep(1000);
      expect(form.isShowingNotFound()).to.eventually.equal(true);
    });
  });

});