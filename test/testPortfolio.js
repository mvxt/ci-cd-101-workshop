import { Selector } from 'testcafe';

fixture `Testing Portfolio Section`
    .page `../index.html`;

test('Check section header for title', async t => {
  await t
      .expect(Selector('#portfolio').find('.section-heading').innerText).eql('PORTFOLIO');
});

test('Check section subheading for portfolio', async t => {
  await t
      .expect(Selector('#portfolio').find('.section-subheading').innerText).eql('Lorem ipsum dolor sit amet consectetur.');
});

test('Check for project Threads', async t => {
  await t
      .expect(Selector('#portfolio').find('.portfolio-caption').find('h4').innerText).eql('Threads');
});

