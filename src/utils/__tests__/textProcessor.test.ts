import { analyzeText, formatText } from '../textProcessor';

describe('analyzeText', () => {
  it('counts words, lines, and characters correctly', () => {
    const input = 'Hello world\nThis is a test.\n';
    const result = analyzeText(input);
    expect(result.wordsCount).toBe(6);
    expect(result.linesCount).toBe(2);
    expect(result.charsCount).toBe(27);
  });

  it('handles extra whitespace', () => {
    const input = '  Hello hello    world  ';
    const result = analyzeText(input);
    expect(result.wordsCount).toBe(3);
    expect(result.linesCount).toBe(1);
    expect(result.charsCount).toBe(20);
  });
});

describe('formatText', () => {
  it('trims and normalizes spaces and newlines', () => {
    const input = '  Hello   world\n\nThis   is    a test.  ';
    const formatted = formatText(input);
    expect(formatted).toBe('Hello world This is a test.');
  });
});
