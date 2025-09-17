import { ThousandsSeparatorPipe } from './thousands-separator.pipe';

describe('ThousandsSeparatorPipe', () => {
  it('create an instance', () => {
    const pipe = new ThousandsSeparatorPipe();
    expect(pipe).toBeTruthy();
  });
});
