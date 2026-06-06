import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { isAllowedCorsOrigin } from '../src/config/cors.js';

describe('cors', () => {
    const originalEnv = { ...process.env };

    beforeEach(() => {
        process.env = { ...originalEnv, NODE_ENV: 'development' };
    });

    afterEach(() => {
        process.env = originalEnv;
    });

    it('allows localhost and LAN dev origins', () => {
        assert.equal(isAllowedCorsOrigin('http://localhost:5173'), true);
        assert.equal(isAllowedCorsOrigin('http://172.30.212.151:5173'), true);
        assert.equal(isAllowedCorsOrigin('http://192.168.1.42:5173'), true);
    });

    it('allows portlifyai.app in production', () => {
        assert.equal(
            isAllowedCorsOrigin('https://portlifyai.app', { isProduction: true }),
            true,
        );
    });

    it('allows FRONTEND_URL from env in production', () => {
        process.env.FRONTEND_URL = 'https://custom.example.com';
        assert.equal(
            isAllowedCorsOrigin('https://custom.example.com', { isProduction: true }),
            true,
        );
    });

    it('blocks unknown origins in production', () => {
        assert.equal(
            isAllowedCorsOrigin('http://172.30.212.151:5173', { isProduction: true }),
            false,
        );
    });
});