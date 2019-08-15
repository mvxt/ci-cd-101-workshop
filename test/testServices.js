import { Selector } from 'testcafe';

fixture `Testing Services Section`
    .page `../index.html`;

test('Check section header for services', async t => {
  await t
      .expect(Selector('#services').find('.section-heading').innerText).eql('SERVICES');
});

test('Check section subheading for services', async t => {
  await t
      .expect(Selector('#services').find('.section-subheading').innerText).eql('Lorem ipsum dolor sit amet consectetur.');
});

test('Check we mention e-commerce', async t => {
  await t
      .expect(Selector('#services').find('.service-heading').innerText).eql('E-Commerce');
});


