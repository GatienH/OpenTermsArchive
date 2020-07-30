import chai from 'chai';

import filter from './index.js';

const expect = chai.expect;

const virtualLocation = "https://exemple.com/main";
const rawHTML = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>TOS</title>
  </head>
  <body>
    <h1>Title</h1>
    <p><a href="/relative/link">link 1</a></p>
    <p><a id="link2" href="">link 2</a></p>
  </body>
</html>`;

const expectedFiltered = `Title
=====

[link 1](https://exemple.com/relative/link)

link 2`;

const expectedFilteredWithAdditional = `Title
=====`;

const additionalFilter = {
  removeLinks: function removeLinks(document) {
    const links = document.querySelectorAll('a');
    links.forEach(link => {
      link.remove();
    });
  }
}

describe('Filter', () => {
  describe('#filter', () => {
    it('filters the given HTML content', async () => {
      const result = await filter(rawHTML, 'body', virtualLocation);
      expect(result).to.equal(expectedFiltered);
    });

    context('With no match for the given selector', () => {
      it('returns an empty string', async () => {
        const result = await filter(rawHTML, '#thisAnchorDoesNotExist', virtualLocation);
        expect(result).to.equal('');
      });
    });

    context('With an additional filter', () => {
      it('filters the given HTML content also with given additional filter', async () => {
        const result = await filter(rawHTML, 'body', virtualLocation, ['removeLinks'], additionalFilter);
        expect(result).to.equal(expectedFilteredWithAdditional);
      });
    });

    context('With multiple selectors', () => {
      it('filters the given HTML content', async () => {
        const result = await filter(rawHTML, 'h1, #link2', virtualLocation);
        expect(result).to.equal(`Title
link 2`);
      });
    });
  });
});
