const superagent = require('superagent');
const cheerio = require('cheerio');
const events = require('events');
const fs = require('fs');

const emitter = new events.EventEmitter();

const baseUrl = 'https://movie.douban.com/top250';

const getMovie = start => {
    superagent.get(baseUrl).query({ start: start }).end((err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        let data = [];
        const $ = cheerio.load(res.text);
        $('.grid_view .item').each((i, e) => {
            const _this = $(e);
            data.push({
                No: _this.find('em').text(),
                Name: _this.find('.title').text()
            });
        });
        fs.writeFile(__dirname + '/data/Top250-' + start / 25 + '.json', JSON.stringify(data), err => {});
        console.log(start, 'OK');
    });
};

for (let i = 0; i <= 225; i += 25) {
    getMovie(i);
}