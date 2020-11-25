const parse = require('./parseNumbers.minimal');

expect.extend({
   toBeSigned(unsigned, bits, signed) {
       const got = parse.signed(unsigned, bits);
       const pass = got === signed;
       if (pass) {
           return {
               message: () =>
                   `expected unsigned ${unsigned} with ${bits} bits not to be signed ${signed}, but it was`,
               pass: true,
           }
       } else {
           return {
               message: () =>
                   `expected unsigned ${unsigned} with ${bits} bits to be signed ${signed}, but it was ${got}`,
               pass: false,
           }
       }
   }
});

test('signed', ()=> {
    let cases = [
        [3, [
            [0b000, +0b000],
            [0b001, +0b001],
            [0b010, +0b010],
            [0b011, +0b011],
            [0b100, -0b100],
            [0b101, -0b011],
            [0b110, -0b010],
            [0b111, -0b001],
        ]],
        [8, [
            [0x00, +0x00],
            [0x0f, +0x0f],
            [0x7f, +0x7f],
            [0x80, -0x80],
            [0x81, -0x7f],
            [0xf0, -0x10],
            [0xf1, -0x0f],
            [0xff, -0x01],
        ]],
        [16, [
            [0x0000, +0x0000],
            [0x00ff, +0x00ff],
            [0x0aaa, +0x0aaa],
            [0x7fff, +0x7fff],
            [0x8000, -0x8000],
            [0x8001, -0x7fff],
            [0xa000, -0x6000],
            [0xfffe, -0x0002],
            [0xffff, -0x0001],
        ]],
        [24, [
            [0x000000, +0x000000],
            [0x000001, +0x000001],
            [0x7fffff, +0x7fffff],
            [0x800000, -0x800000],
            [0xffffff, -0x000001],
        ]],
        [32, [
            [0x00000000, +0x00000000],
            [0x00000001, +0x00000001],
            [0x7fffffff, +0x7fffffff],
            [0x80000000, -0x80000000],
            [0xffffffff, -0x00000001],
        ]],
        [40, [
            [0x0000000000, +0x0000000000],
            [0x0000000001, +0x0000000001],
            [0x7fffffffff, +0x7fffffffff],
            [0x8000000000, -0x8000000000],
            [0xabcdef0123, -0x543210fedd],
            [0xffffffffff, -0x0000000001],
        ]],
        [48, [
            [0x000000000000, +0x000000000000],
            [0x000000000001, +0x000000000001],
            [0x7fffffffffff, +0x7fffffffffff],
            [0x800000000000, -0x800000000000],
            [0xabcdef012345, -0x543210fedcbb],
            [0xffffffffffff, -0x000000000001],
        ]],
    ];
    for (let [bits, bitcases] of cases) {
        for (let [unsigned, signed] of bitcases) {
            expect(unsigned).toBeSigned(bits, signed);
        }
    }
});

// Convert a hex string to a byte array
function hexToBytes(hex) {
    for (var bytes = [], c = 0; c < hex.length; c += 2) {
        bytes.push(parseInt(hex.substr(c, 2), 16));
    }
    return bytes;
}
expect.extend({
   toBeParsed(hexstr, parser, number) {
       const bytes = hexToBytes(hexstr);
       const got = parser(bytes);
       const pass = got === number;
       if (pass) {
           return {
               message: () =>
                   `expected "${hexstr}" parsed with ${parser.name}() not to be ${number}, but it was`,
               pass: true,
           }
       } else {
           return {
               message: () =>
                   `expected "${hexstr}" parsed with ${parser.name}() to be ${number}, but it was ${got}`,
               pass: false,
           }
       }
   }
});

test('intParser', ()=>{
    // uint8
    expect("00").toBeParsed(parse.uint8, +0x00);
    expect("7f").toBeParsed(parse.uint8, +0x7f);
    expect("80").toBeParsed(parse.uint8, +0x80);
    expect("ff").toBeParsed(parse.uint8, +0xff);
    // int8
    expect("00").toBeParsed(parse.int8, +0x00);
    expect("7f").toBeParsed(parse.int8, +0x7f);
    expect("80").toBeParsed(parse.int8, -0x80);
    expect("ff").toBeParsed(parse.int8, -0x01);
    // uint16_BE:
    expect("0000").toBeParsed(parse.uint16_BE, +0x0000);
    expect("0102").toBeParsed(parse.uint16_BE, +0x0102);
    expect("7fff").toBeParsed(parse.uint16_BE, +0x7fff);
    expect("8000").toBeParsed(parse.uint16_BE, +0x8000);
    expect("abcd").toBeParsed(parse.uint16_BE, +0xabcd);
    expect("ffff").toBeParsed(parse.uint16_BE, +0xffff);
    // uint24_BE:
    expect("000000").toBeParsed(parse.uint24_BE, +0x000000);
    expect("010203").toBeParsed(parse.uint24_BE, +0x010203);
    expect("7fffff").toBeParsed(parse.uint24_BE, +0x7fffff);
    expect("800000").toBeParsed(parse.uint24_BE, +0x800000);
    expect("abcdef").toBeParsed(parse.uint24_BE, +0xabcdef);
    expect("ffffff").toBeParsed(parse.uint24_BE, +0xffffff);
    // uint32_BE:
    expect("00000000").toBeParsed(parse.uint32_BE, +0x00000000);
    expect("01020304").toBeParsed(parse.uint32_BE, +0x01020304);
    expect("7fffffff").toBeParsed(parse.uint32_BE, +0x7fffffff);
    expect("80000000").toBeParsed(parse.uint32_BE, +0x80000000);
    expect("abcdef01").toBeParsed(parse.uint32_BE, +0xabcdef01);
    expect("ffffffff").toBeParsed(parse.uint32_BE, +0xffffffff);
    // uint40_BE:
    expect("0000000000").toBeParsed(parse.uint40_BE, +0x0000000000);
    expect("0102030405").toBeParsed(parse.uint40_BE, +0x0102030405);
    expect("7fffffffff").toBeParsed(parse.uint40_BE, +0x7fffffffff);
    expect("8000000000").toBeParsed(parse.uint40_BE, +0x8000000000);
    expect("abcdef0102").toBeParsed(parse.uint40_BE, +0xabcdef0102);
    expect("ffffffffff").toBeParsed(parse.uint40_BE, +0xffffffffff);
    // uint48_BE:
    expect("000000000000").toBeParsed(parse.uint48_BE, +0x000000000000);
    expect("010203040506").toBeParsed(parse.uint48_BE, +0x010203040506);
    expect("7fffffffffff").toBeParsed(parse.uint48_BE, +0x7fffffffffff);
    expect("800000000000").toBeParsed(parse.uint48_BE, +0x800000000000);
    expect("abcdef010203").toBeParsed(parse.uint48_BE, +0xabcdef010203);
    expect("ffffffffffff").toBeParsed(parse.uint48_BE, +0xffffffffffff);
    // int16_BE:
    expect("0000").toBeParsed(parse.int16_BE, +0x0000);
    expect("0102").toBeParsed(parse.int16_BE, +0x0102);
    expect("7fff").toBeParsed(parse.int16_BE, +0x7fff);
    expect("8000").toBeParsed(parse.int16_BE, -0x8000);
    expect("abcd").toBeParsed(parse.int16_BE, -0x5433);
    expect("ffff").toBeParsed(parse.int16_BE, -0x0001);
    // int24_BE:
    expect("000000").toBeParsed(parse.int24_BE, +0x000000);
    expect("010203").toBeParsed(parse.int24_BE, +0x010203);
    expect("7fffff").toBeParsed(parse.int24_BE, +0x7fffff);
    expect("800000").toBeParsed(parse.int24_BE, -0x800000);
    expect("abcdef").toBeParsed(parse.int24_BE, -0x543211);
    expect("ffffff").toBeParsed(parse.int24_BE, -0x000001);
    // int32_BE:
    expect("00000000").toBeParsed(parse.int32_BE, +0x00000000);
    expect("01020304").toBeParsed(parse.int32_BE, +0x01020304);
    expect("7fffffff").toBeParsed(parse.int32_BE, +0x7fffffff);
    expect("80000000").toBeParsed(parse.int32_BE, -0x80000000);
    expect("abcdef01").toBeParsed(parse.int32_BE, -0x543210ff);
    expect("ffffffff").toBeParsed(parse.int32_BE, -0x00000001);
    // int40_BE:
    expect("0000000000").toBeParsed(parse.int40_BE, +0x0000000000);
    expect("0102030405").toBeParsed(parse.int40_BE, +0x0102030405);
    expect("7fffffffff").toBeParsed(parse.int40_BE, +0x7fffffffff);
    expect("8000000000").toBeParsed(parse.int40_BE, -0x8000000000);
    expect("abcdef0102").toBeParsed(parse.int40_BE, -0x543210fefe);
    expect("ffffffffff").toBeParsed(parse.int40_BE, -0x0000000001);
    // int48_BE:
    expect("000000000000").toBeParsed(parse.int48_BE, +0x000000000000);
    expect("010203040506").toBeParsed(parse.int48_BE, +0x010203040506);
    expect("7fffffffffff").toBeParsed(parse.int48_BE, +0x7fffffffffff);
    expect("800000000000").toBeParsed(parse.int48_BE, -0x800000000000);
    expect("abcdef010203").toBeParsed(parse.int48_BE, -0x543210fefdfd);
    expect("ffffffffffff").toBeParsed(parse.int48_BE, -0x000000000001);

    // uint16_LE:
    expect("0000").toBeParsed(parse.uint16_LE, +0x0000);
    expect("0201").toBeParsed(parse.uint16_LE, +0x0102);
    expect("ff7f").toBeParsed(parse.uint16_LE, +0x7fff);
    expect("0080").toBeParsed(parse.uint16_LE, +0x8000);
    expect("cdab").toBeParsed(parse.uint16_LE, +0xabcd);
    expect("ffff").toBeParsed(parse.uint16_LE, +0xffff);
    // uint24_LE:
    expect("000000").toBeParsed(parse.uint24_LE, +0x000000);
    expect("030201").toBeParsed(parse.uint24_LE, +0x010203);
    expect("ffff7f").toBeParsed(parse.uint24_LE, +0x7fffff);
    expect("000080").toBeParsed(parse.uint24_LE, +0x800000);
    expect("efcdab").toBeParsed(parse.uint24_LE, +0xabcdef);
    expect("ffffff").toBeParsed(parse.uint24_LE, +0xffffff);
    // uint32_LE:
    expect("00000000").toBeParsed(parse.uint32_LE, +0x00000000);
    expect("04030201").toBeParsed(parse.uint32_LE, +0x01020304);
    expect("ffffff7f").toBeParsed(parse.uint32_LE, +0x7fffffff);
    expect("00000080").toBeParsed(parse.uint32_LE, +0x80000000);
    expect("01efcdab").toBeParsed(parse.uint32_LE, +0xabcdef01);
    expect("ffffffff").toBeParsed(parse.uint32_LE, +0xffffffff);
    // uint40_LE:
    expect("0000000000").toBeParsed(parse.uint40_LE, +0x0000000000);
    expect("0504030201").toBeParsed(parse.uint40_LE, +0x0102030405);
    expect("ffffffff7f").toBeParsed(parse.uint40_LE, +0x7fffffffff);
    expect("0000000080").toBeParsed(parse.uint40_LE, +0x8000000000);
    expect("0201efcdab").toBeParsed(parse.uint40_LE, +0xabcdef0102);
    expect("ffffffffff").toBeParsed(parse.uint40_LE, +0xffffffffff);
    // uint48_LE:
    expect("000000000000").toBeParsed(parse.uint48_LE, +0x000000000000);
    expect("060504030201").toBeParsed(parse.uint48_LE, +0x010203040506);
    expect("ffffffffff7f").toBeParsed(parse.uint48_LE, +0x7fffffffffff);
    expect("000000000080").toBeParsed(parse.uint48_LE, +0x800000000000);
    expect("030201efcdab").toBeParsed(parse.uint48_LE, +0xabcdef010203);
    expect("ffffffffffff").toBeParsed(parse.uint48_LE, +0xffffffffffff);
    // int16_LE:
    expect("0000").toBeParsed(parse.int16_LE, +0x0000);
    expect("0201").toBeParsed(parse.int16_LE, +0x0102);
    expect("ff7f").toBeParsed(parse.int16_LE, +0x7fff);
    expect("0080").toBeParsed(parse.int16_LE, -0x8000);
    expect("cdab").toBeParsed(parse.int16_LE, -0x5433);
    expect("ffff").toBeParsed(parse.int16_LE, -0x0001);
    // int24_LE:
    expect("000000").toBeParsed(parse.int24_LE, +0x000000);
    expect("030201").toBeParsed(parse.int24_LE, +0x010203);
    expect("ffff7f").toBeParsed(parse.int24_LE, +0x7fffff);
    expect("000080").toBeParsed(parse.int24_LE, -0x800000);
    expect("efcdab").toBeParsed(parse.int24_LE, -0x543211);
    expect("ffffff").toBeParsed(parse.int24_LE, -0x000001);
    // int32_LE:
    expect("00000000").toBeParsed(parse.int32_LE, +0x00000000);
    expect("04030201").toBeParsed(parse.int32_LE, +0x01020304);
    expect("ffffff7f").toBeParsed(parse.int32_LE, +0x7fffffff);
    expect("00000080").toBeParsed(parse.int32_LE, -0x80000000);
    expect("01efcdab").toBeParsed(parse.int32_LE, -0x543210ff);
    expect("ffffffff").toBeParsed(parse.int32_LE, -0x00000001);
    // int40_LE:
    expect("0000000000").toBeParsed(parse.int40_LE, +0x0000000000);
    expect("0504030201").toBeParsed(parse.int40_LE, +0x0102030405);
    expect("ffffffff7f").toBeParsed(parse.int40_LE, +0x7fffffffff);
    expect("0000000080").toBeParsed(parse.int40_LE, -0x8000000000);
    expect("0201efcdab").toBeParsed(parse.int40_LE, -0x543210fefe);
    expect("ffffffffff").toBeParsed(parse.int40_LE, -0x0000000001);
    // int48_LE:
    expect("000000000000").toBeParsed(parse.int48_LE, +0x000000000000);
    expect("060504030201").toBeParsed(parse.int48_LE, +0x010203040506);
    expect("ffffffffff7f").toBeParsed(parse.int48_LE, +0x7fffffffffff);
    expect("000000000080").toBeParsed(parse.int48_LE, -0x800000000000);
    expect("030201efcdab").toBeParsed(parse.int48_LE, -0x543210fefdfd);
    expect("ffffffffffff").toBeParsed(parse.int48_LE, -0x000000000001);

    // test index parameter
    expect(parse.uint16_BE(new Uint8Array([0x20, 0x10, 0x12, 0x34]), 2)).toBe(0x1234);
    expect(parse.uint16_BE(new Uint8Array([0x20, 0x10, 0x12, 0x34]), 0)).toBe(0x2010);
    expect(parse.uint16_BE(new Uint8Array([0x20, 0x10, 0x12, 0x34]))).toBe(0x2010);
    expect(parse.uint16_BE(new Uint8Array([0x20, 0x10, 0x12, 0x34, 0xaa, 0xbb, 0x18, 0x19, 0x20]), 4)).toBe(0xaabb);
    expect(parse.uint16_LE(new Uint8Array([0x20, 0x10, 0x12, 0x34]), 2)).toBe(0x3412);
    expect(parse.uint16_LE(new Uint8Array([0x20, 0x10, 0x12, 0x34]), 0)).toBe(0x1020);
    expect(parse.uint16_LE(new Uint8Array([0x20, 0x10, 0x12, 0x34]))).toBe(0x1020);
    expect(parse.uint16_LE(new Uint8Array([0x20, 0x10, 0x12, 0x34, 0xaa, 0xbb, 0x18, 0x19, 0x20]), 4)).toBe(0xbbaa);

    // additional otherwise untested paths:
    expect(parse.uint_BE(new Uint8Array([0x20, 0x10, 0xab, 0x34]), 1, 2)).toBe(0xab);
    expect(parse.uint_LE(new Uint8Array([0x20, 0x10, 0xab, 0x34]), 1, 2)).toBe(0xab);
    expect(parse.int_BE(new Uint8Array([0x20, 0x10, 0xab, 0x34]), 1, 2)).toBe(-0x55);
    expect(parse.int_LE(new Uint8Array([0x20, 0x10, 0xab, 0x34]), 1, 2)).toBe(-0x55);
});

test('floatParser', ()=> {
    expect(parse.float32_BE(hexToBytes("c49a4000"))).toBe(-1234);
    expect(parse.float32_BE(hexToBytes("3f800000"))).toBe(1);
    expect(parse.float32_BE(hexToBytes("bf800000"))).toBe(-1);
    expect(parse.float32_BE(hexToBytes("00000000"))).toBe(0);
    expect(parse.float32_BE(hexToBytes("40490fdb"))).toBe(3.1415927410125732);
    expect(parse.float32_BE(hexToBytes("0f1ff016"))).toBe(7.885544115259558e-30);
    expect(parse.float32_BE(hexToBytes("7a806534"))).toBe(3.3333332056343875e+35);

    expect(parse.float32_LE(hexToBytes("00409ac4"))).toBe(-1234);
    expect(parse.float32_LE(hexToBytes("0000803f"))).toBe(1);
    expect(parse.float32_LE(hexToBytes("000080bf"))).toBe(-1);
    expect(parse.float32_LE(hexToBytes("00000000"))).toBe(0);
    expect(parse.float32_LE(hexToBytes("db0f4940"))).toBe(3.1415927410125732);
    expect(parse.float32_LE(hexToBytes("16f01f0f"))).toBe(7.885544115259558e-30);
    expect(parse.float32_LE(hexToBytes("3465807a"))).toBe(3.3333332056343875e+35);
});
