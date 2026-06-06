const ALLOWED_PROFILE_FIELDS = [
    'basicDetails',
    'skills',
    'experience',
    'education',
    'projects',
    'achievements',
    'extraCurricular',
    'certifications',
    'publications',
    'volunteering',
    'references',
    'socialLinks',
    'customSections',
    'resumeUrl',
    'theme',
    'ogMetadata'
];

const DEFAULT_SKILLS = {
    programmingLanguages: [],
    frameworks: [],
    databases: [],
    tools: [],
    cloudSystems: [],
    softSkills: []
};

/**
 * Pick only allowed profile fields from a request body.
 */
export function pickAllowedProfileFields(body) {
    const updates = {};
    for (const key of ALLOWED_PROFILE_FIELDS) {
        if (body[key] !== undefined) {
            updates[key] = body[key];
        }
    }
    return updates;
}

export function getDefaultSkills() {
    return { ...DEFAULT_SKILLS };
}

export function getEmptyProfileData() {
    return {
        basicDetails: {
            name: '',
            headline: '',
            email: '',
            phone: '',
            location: '',
            profilePhoto: '',
            about: ''
        },
        skills: getDefaultSkills(),
        experience: [],
        education: [],
        projects: [],
        achievements: [],
        extraCurricular: [],
        certifications: [],
        publications: [],
        volunteering: [],
        references: [],
        socialLinks: {
            linkedin: '',
            github: '',
            twitter: '',
            website: '',
            email: ''
        },
        customSections: [],
        resumeUrl: '',
        ogMetadata: {
            title: '',
            description: '',
            image: ''
        },
        stats: {
            totalViews: 0,
            lastViewed: null
        }
    };
}