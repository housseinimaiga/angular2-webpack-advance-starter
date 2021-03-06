import { t } from 'shared/test/index';

declare var browser: any;
declare var element: any;
declare var by: any;

t.describe('About', () => {

  t.be(() => {
    browser.get('/about');
  });

  t.it('should have correct feature heading', () => {
    browser.wait(element(by.css('sd-about h2')).isPresent(), 20000);
    let el = element(by.css('sd-about h2'));
    t.e(el.getText()).toEqual('Features');
  });
});
