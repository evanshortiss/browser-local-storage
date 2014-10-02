'use strict';

// ls module will be global as it binds to window
var expect = chai.expect
    , TEST_STR_KEY = 'TEST_STR_KEY'
    , TEST_STR = 'TEST_STR'
    , TEST_OBJ_KEY = 'TEST_OBJ_KEY'
    , TEST_OBJ = {
      hello: 'world'
    };

describe('ls Module', function () {

  afterEach(function () {
    localStorage.removeItem(TEST_STR_KEY);
    localStorage.removeItem(TEST_OBJ_KEY);
  });


  describe('ls Namespace', function () {
    it('Should be defined on window', function () {
      expect(window.ls).to.be.defined;
    });
  });


  describe('#get', function () {
    it('Should try get an item not in localStorage', function () {
      ls.get(TEST_STR_KEY, function (err, res) {
        expect(err).to.be.null;
        expect(res).to.be.null;
      });
    });

    it('Should get an item from localStorage', function () {
      localStorage.setItem(TEST_STR_KEY, TEST_STR);

      ls.get(TEST_STR_KEY, function (err, res) {
        expect(err).to.be.null;
        expect(res).to.be.a('string');
        expect(res).to.equal(TEST_STR);
      });
    });
  });


  describe('#getJson', function () {
    it('Should try get an item not in localStorage', function () {
      ls.getJson(TEST_OBJ_KEY, function (err, res) {
        expect(err).to.be.null;
        expect(res).to.be.null;
      });
    });

    it('Should get an item from localStorage', function () {
      localStorage.setItem(TEST_OBJ_KEY, JSON.stringify(TEST_OBJ));

      ls.getJson(TEST_OBJ_KEY, function (err, res) {
        expect(err).to.be.null;
        expect(res).to.be.an('object');
        expect(JSON.stringify(res)).to.equal(JSON.stringify(TEST_OBJ));
      });
    });
  });


  describe('#set', function () {
    it ('Should set an item in localStorage', function () {
      ls.set(TEST_STR_KEY, TEST_STR, function (err) {
        expect(err).to.be.null;

        ls.get(TEST_STR_KEY, function (err, res) {
          expect(err).to.be.null;
          expect(res).to.be.a('string');
          expect(res).to.equal(TEST_STR);
        });
      });
    });
  });


  describe('#setJson', function () {
    it ('Should set a JSON object and retreive it', function () {
      ls.setJson(TEST_OBJ_KEY, TEST_OBJ, function (err) {
        expect(err).to.be.null;

        ls.getJson(TEST_OBJ_KEY, function (err, res) {
          expect(err).to.be.null;
          expect(res).to.be.an('object');
          expect(JSON.stringify(res)).to.equal(JSON.stringify(TEST_OBJ));
        });
      });
    });
  });


  describe('#remove', function () {
    it ('Should set an item, remove it, verify it was removed', function () {
      ls.set(TEST_STR_KEY, TEST_STR, function (err) {
        expect(err).to.be.null;

        ls.remove(TEST_STR_KEY, function (err) {
          expect(err).to.be.null;

          ls.get(TEST_STR_KEY, function (err, res) {
            expect(err).to.be.null;
            expect(res).to.be.null;
          });
        });
      });
    });
  });
});
