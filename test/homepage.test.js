const request = require("supertest");
const expect = require("expect");
var app = require("../app/controller").app;

describe("Homepage Tests", () => {
  it('should return my homepage', (done) => {
    request(app)
    .get('/')
    .expect(200)
    .expect((resp) => {
      expect(resp.text.indexOf("Portfolio")).toBeGreaterThanOrEqual(0);
    })
    .end(done);
  });

  it('garbage should get automatically redirected', (done) => {
    request(app)
    .get('/nosuchpage')
    .expect(302)
    .end(done);
  });
});