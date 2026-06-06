import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { pickAllowedProfileFields, getDefaultSkills, getEmptyProfileData } from '../src/utils/profileFields.js';

describe('pickAllowedProfileFields', () => {
    it('allows valid profile fields', () => {
        const result = pickAllowedProfileFields({
            basicDetails: { name: 'Test' },
            skills: { programmingLanguages: ['JS'] },
            experience: [],
            username: 'hacked',
            userId: '123'
        });

        assert.equal(result.basicDetails.name, 'Test');
        assert.equal(result.username, undefined);
        assert.equal(result.userId, undefined);
    });

    it('returns default skills shape', () => {
        const skills = getDefaultSkills();
        assert.ok(Array.isArray(skills.programmingLanguages));
        assert.ok(Array.isArray(skills.softSkills));
        assert.equal(skills.technical, undefined);
    });
});

describe('getEmptyProfileData', () => {
    it('does not reset visibility, theme, or branding fields', () => {
        const empty = getEmptyProfileData();
        assert.equal(empty.isPublic, undefined);
        assert.equal(empty.theme, undefined);
        assert.equal(empty.customBranding, undefined);
    });
});