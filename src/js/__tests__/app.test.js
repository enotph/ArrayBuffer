import ArrayBufferConverter, { getBuffer } from '../app';

describe('getBuffer', () => {
  test('возвращает ArrayBuffer', () => {
    const buffer = getBuffer();

    expect(buffer).toBeInstanceOf(ArrayBuffer);
  });

  test('размер буфера = длина строки * 2', () => {
    const buffer = getBuffer();
    const data = '{"data":{"user":{"id":1,"name":"Hitman","level":10}}}';

    expect(buffer.byteLength).toBe(data.length * 2);
  });
});

describe('ArrayBufferConverter', () => {
  let converter;
  let buffer;

  beforeEach(() => {
    converter = new ArrayBufferConverter();
    buffer = getBuffer();
  });

  test('load сохраняет буфер', () => {
    converter.load(buffer);

    expect(converter.buffer).toBe(buffer);
  });

  test('toString возвращает исходную строку', () => {
    converter.load(buffer);

    expect(converter.toString()).toBe(
      '{"data":{"user":{"id":1,"name":"Hitman","level":10}}}',
    );
  });

  test('toString работает с пустым буфером', () => {
    const emptyBuffer = new ArrayBuffer(0);
    converter.load(emptyBuffer);

    expect(converter.toString()).toBe('');
  });

  test('toString корректен при повторной загрузке другого буфера', () => {
    const buffer1 = getBuffer();
    converter.load(buffer1);
    expect(converter.toString()).toBe(
      '{"data":{"user":{"id":1,"name":"Hitman","level":10}}}',
    );

    const custom = (input) => {
      const buf = new ArrayBuffer(input.length * 2);
      const view = new Uint16Array(buf);
      for (let i = 0; i < input.length; i += 1) {
        view[i] = input.charCodeAt(i);
      }
      return buf;
    };

    converter.load(custom('hello'));
    expect(converter.toString()).toBe('hello');
  });
});
