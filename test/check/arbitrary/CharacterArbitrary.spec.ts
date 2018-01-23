import * as assert from 'power-assert';
import * as fc from '../../../lib/fast-check';

import { char, ascii, unicode, hexa, base64 } from '../../../src/check/arbitrary/CharacterArbitrary';
import MutableRandomGenerator from '../../../src/random/generator/MutableRandomGenerator';

import { FastIncreaseRandomGenerator, CounterRandomGenerator } from '../../stubs/generators';

describe("CharacterArbitrary", () => {
    describe('char', () => {
        it('Should generate a single printable character', () => fc.assert(
            fc.property(fc.integer(), (seed) => {
                const mrng = new MutableRandomGenerator(new FastIncreaseRandomGenerator(seed));
                const g = char().generate(mrng).value;
                return g.length === 1 && 0x20 <= g.charCodeAt(0) && g.charCodeAt(0) <= 0x7e;
            })
        ));
        it('Should be able to produce any printable character', () => fc.assert(
            fc.property(fc.integer(), fc.integer(32, 126), (seed, selected) => {
                const mrng = new MutableRandomGenerator(new CounterRandomGenerator(seed));
                const arb = char();
                const waitingFor = String.fromCharCode(selected);
                for (let t = 0 ; t !== 96 ; ++t) { // check for equiprobable at the same time
                    if (arb.generate(mrng).value === waitingFor) {
                        return true;
                    }
                }
                throw `Unable to produce '${waitingFor}' (${selected}) given seed ${seed}`;
            })
        ));
    });
    describe('ascii', () => {
        it('Should generate a single ascii character', () => fc.assert(
            fc.property(fc.integer(), (seed) => {
                const mrng = new MutableRandomGenerator(new FastIncreaseRandomGenerator(seed));
                const g = ascii().generate(mrng).value;
                return g.length === 1 && 0x00 <= g.charCodeAt(0) && g.charCodeAt(0) <= 0x7f;
            })
        ));
        it('Should be able to produce any character from ascii', () => fc.assert(
            fc.property(fc.integer(), fc.integer(0, 127), (seed, selected) => {
                const mrng = new MutableRandomGenerator(new CounterRandomGenerator(seed));
                const arb = ascii();
                const waitingFor = String.fromCharCode(selected);
                for (let t = 0 ; t !== 128 ; ++t) { // check for equiprobable at the same time
                    if (arb.generate(mrng).value === waitingFor) {
                        return true;
                    }
                }
                throw `Unable to produce '${waitingFor}' (${selected}) given seed ${seed}`;
            })
        ));
    });
    describe('unicode', () => {
        it('Should generate a single unicode character', () => fc.assert(
            fc.property(fc.integer(), (seed) => {
                const mrng = new MutableRandomGenerator(new FastIncreaseRandomGenerator(seed));
                const g = unicode().generate(mrng).value;
                return g.length === 1 && 0x0000 <= g.charCodeAt(0) && g.charCodeAt(0) <= 0xffff;
            })
        ));
        it('Should be able to produce any character from unicode', () => fc.assert(
            fc.property(fc.integer(), fc.integer(0, 65535), (seed, selected) => {
                const mrng = new MutableRandomGenerator(new CounterRandomGenerator(seed));
                const arb = unicode();
                const waitingFor = String.fromCharCode(selected);
                for (let t = 0 ; t !== 65536 ; ++t) { // check for equiprobable at the same time
                    if (arb.generate(mrng).value === waitingFor) {
                        return true;
                    }
                }
                throw `Unable to produce '${waitingFor}' (${selected}) given seed ${seed}`;
            })
        ));
    });
    describe('hexa', () => {
        it('Should generate a single hexa character', () => fc.assert(
            fc.property(fc.integer(), (seed) => {
                const mrng = new MutableRandomGenerator(new FastIncreaseRandomGenerator(seed));
                const g = hexa().generate(mrng).value;
                return g.length === 1 && (('0' <= g && g <= '9') || ('a' <= g && g <= 'f'));
            })
        ));
        it('Should be able to produce any character from hexa', () => fc.assert(
            fc.property(fc.integer(), fc.integer(0, 15), (seed, selected) => {
                const mrng = new MutableRandomGenerator(new CounterRandomGenerator(seed));
                const arb = hexa();
                const waitingFor = '0123456789abcdef'[selected];
                for (let t = 0 ; t !== 16 ; ++t) { // check for equiprobable at the same time
                    if (arb.generate(mrng).value === waitingFor) {
                        return true;
                    }
                }
                throw `Unable to produce '${waitingFor}' (${selected}) given seed ${seed}`;
            })
        ));
        it('Should shrink within hexa characters', () => fc.assert(
            fc.property(fc.integer(), (seed) => {
                const mrng = new MutableRandomGenerator(new FastIncreaseRandomGenerator(seed));
                const shrinkable = hexa().generate(mrng);
                return shrinkable.shrink().every(s => 
                    s.value.length === 1 && (('0' <= s.value && s.value <= '9') || ('a' <= s.value && s.value <= 'f'))
                );
            })
        ));
    });
    describe('base64', () => {
        it('Should generate a single base64 character', () => fc.assert(
            fc.property(fc.integer(), (seed) => {
                const mrng = new MutableRandomGenerator(new FastIncreaseRandomGenerator(seed));
                const g = base64().generate(mrng).value;
                return g.length === 1 && (
                    ('a' <= g && g <= 'z') ||
                    ('A' <= g && g <= 'Z') ||
                    ('0' <= g && g <= '9') ||
                    g === '+' || g === '/'
                );
            })
        ));
        it('Should be able to produce any character from base64', () => fc.assert(
            fc.property(fc.integer(), fc.integer(0, 63), (seed, selected) => {
                const mrng = new MutableRandomGenerator(new CounterRandomGenerator(seed));
                const arb = base64();
                const waitingFor = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'[selected];
                for (let t = 0 ; t !== 64 ; ++t) { // check for equiprobable at the same time
                    if (arb.generate(mrng).value === waitingFor) {
                        return true;
                    }
                }
                throw `Unable to produce '${waitingFor}' (${selected}) given seed ${seed}`;
            })
        ));
        it('Should shrink within base64 characters', () => fc.assert(
            fc.property(fc.integer(), (seed) => {
                const mrng = new MutableRandomGenerator(new FastIncreaseRandomGenerator(seed));
                const shrinkable = base64().generate(mrng);
                return shrinkable.shrink().every(s => 
                    s.value.length === 1 && (
                        ('a' <= s.value && s.value <= 'z') ||
                        ('A' <= s.value && s.value <= 'Z') ||
                        ('0' <= s.value && s.value <= '9') ||
                        s.value === '+' || s.value === '/'
                ));
            })
        ));
    });
});
