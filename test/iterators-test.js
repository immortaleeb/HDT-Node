require('should');

var hdt = require('../lib/hdt');

function testEntityValue(entities, i, value, done) {
  entities.next(function (entity) {
    entity.should.equal(value);
    done();
  });
}

// Takes a number and prepends it with 0's untill we have a string of length three
function threeNumberString(i) {
  var res = "" + i;
  while (res.length < 3) res = "0" + res;
  return res;
}

describe('hdt', function () {
  describe('An HDT document for an example HDT file', function () {
    var document;
    before(function (done) {
      hdt.fromFile('./test/test.hdt', function (error, hdtDocument) {
        document = hdtDocument;
        done(error);
      });
    });
    after(function (done) {
      document.close(done);
    });

    describe('subjects', function () {
      var subjects;
      before(function () {
        subjects = document.subjects();
      });

      it('should be an object', function () {
        subjects.should.be.an.Object;
      });

      it('should have a next function', function () {
        subjects.should.have.property('next');
        subjects.next.should.be.type('function');
      });

      describe('next', function () {
        var prefix = 'http://example.org/s',
            testSubjectValue;

        before(function () {
          testSubjectValue = function (i, done) {
            testEntityValue(subjects, i, prefix + i, done);
          };
        });

        // Should find 4 subjects
        /* jshint ignore:start */
        var subjectCount = 0;
        for (var i = 1; i <= 4; i++) {
          it('should return subject ' + i, function (done) {
            testSubjectValue(++subjectCount, done);
          });
        }
        /* jshint ignore:end */

        // There should be no 5th subject
        it('should not return a fifth subject', function (done) {
          subjects.next(function (subject) {
            (subject === null).should.be.true;
            done();
          });
        });
      });
    });

    describe('objects', function () {
      var objects;
      before(function () {
        objects = document.objects();
      });

      it('should be an object', function () {
        objects.should.be.an.Object;
      });

      it('should have a next function', function () {
        objects.should.have.property('next');
        objects.next.should.be.type('function');
      });

      describe('next', function () {
        var prefix = 'http://example.org/o',
            objectLiterals = [
              '""',
              '""@en',
              '""^^<http://example.org/literal>',
              '""^^<http://www.w3.org/2001/XMLSchema#string>',
              '"a"',
              '"a"@en',
              '"a"^^<http://example.org/literal>',
              '"a"^^<http://www.w3.org/2001/XMLSchema#string>',
              '"a\"b\'c\\\r\n\\"',
              '"a\"b\'c\\\r\n\\"@en',
              '"a\"b\'c\\\r\n\\"^^<http://example.org/literal>',
              '"a\"b\'c\\\r\n\\"^^<http://www.w3.org/2001/XMLSchema#string>'
            ],
            testObjectValue;

        before(function () {
          testObjectValue = function (i, done) {
            var value = (i <= objectLiterals.length) ?
              objectLiterals[i-1] : 
              prefix + threeNumberString(i - objectLiterals.length);

            testEntityValue(objects, i, value, done);
          };
        });

        // Should find 112 objects
        /* jshint ignore:start */
        var objectCount = 0;
        for (var i = 1; i <= 112; i++) {
          it('should return object ' + i, function (done) {
            testObjectValue(++objectCount, done);
          });
        }
        /* jshint ignore:end */

        // There should be no 113th object
        it('should not return a 113th object', function (done) {
          objects.next(function (object) {
            (object === null).should.be.true;
            done();
          });
        });
      });
    });

    describe('predicates', function () {
      var predicates;
      before(function () {
        predicates = document.predicates();
      });

      it('should be an object', function () {
        predicates.should.be.an.Object;
      });

      it('should have a next function', function () {
        predicates.should.have.property('next');
        predicates.next.should.be.type('function');
      });

      describe('next', function () {
        var prefix = 'http://example.org/p',
            testPredicateValue;

        before(function () {
          testPredicateValue = function (i, done) {
            testEntityValue(predicates, i, prefix + i, done);
          };
        });

        // Should find 3 predicates
        /* jshint ignore:start */
        var predicateCount = 0;
        for (var i = 1; i <= 3; i++) {
          it('should return predicates ' + i, function (done) {
            testPredicateValue(++predicateCount, done);
          });
        }
        /* jshint ignore:end */

        // There should be no 4th predicates
        it('should not return a fourth predicate', function (done) {
          predicates.next(function (predicate) {
            (predicate === null).should.be.true;
            done();
          });
        });
      });
    });

  });
});
