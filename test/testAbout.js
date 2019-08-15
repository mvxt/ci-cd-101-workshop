import { Selector } from 'testcafe';

fixture `Testing About Section`
    .page `../index.html`;

test('Check section header for title', async t => {
  await t
      .expect(Selector('#about').find('.section-heading').innerText).eql('ABOUT');
});

test('Check section subheading for portfolio', async t => {
  await t
      .expect(Selector('#about').find('.section-subheading').innerText).eql('Lorem ipsum dolor sit amet consectetur.');
});

test('Check for humble beginnings date', async t => {
  await t
      .expect(Selector('#about').find('.timeline-heading').find('h4').innerText).eql('2009-2011');
});

test('Check for humble beginnings subheading', async t => {
  await t
      .expect(Selector('#about').find('.timeline-heading').find('.subheading').innerText).eql('Our Humble Beginnings');
});

