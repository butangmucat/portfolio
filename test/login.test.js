const request = require("supertest");
const expect = require("expect");
const cheerio = require('cheerio');
var app = require("../app/controller").app;

function extractCsrfToken(res) {
  var $ = cheerio.load(res.text);
  return $('[name=_csrf]').val();
}

describe("Login Tests", () => {
  var csrfToken;

  it('should get login page', (done) => {
    request(app)
    .get('/login')
    .expect(200)
    .expect((resp) => {
      csrfToken = extractCsrfToken(resp);
      expect(resp.text.indexOf("Login")).toBeGreaterThanOrEqual(0);
    })
    .end(done);
  });

  it('correct login should pass', (done) => {
    request(app)
    .post('/login')
    .send({
      _csrf: csrfToken,
      uname: "abba",
      passwd: "abba"
    })
    .expect(200)
    .expect((resp) => {
      expect(resp.text.indexOf("Admin")).toBeGreaterThanOrEqual(0);
    })
    .end(done);
  });
});