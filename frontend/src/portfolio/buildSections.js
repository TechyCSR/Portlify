import {
    Award,
    BookOpen,
    Briefcase,
    Code,
    GraduationCap,
    Heart,
    Rocket,
    Sparkles,
    User,
    Users,
} from 'lucide-react'

function hasSkills(skills) {
    if (!skills) return false
    return Object.values(skills).some((list) => Array.isArray(list) && list.length > 0)
}

export function buildPortfolioSections(profile) {
    if (!profile) return []

    const {
        basicDetails,
        skills,
        experience,
        education,
        projects,
        achievements,
        certifications,
        publications,
        volunteering,
        extraCurricular,
        references,
        customSections,
    } = profile

    const sections = []

    if (basicDetails?.about) {
        sections.push({ id: 'about', label: 'About', icon: User, type: 'about' })
    }

    if (experience?.length > 0) {
        sections.push({ id: 'experience', label: 'Experience', icon: Briefcase, type: 'experience', items: experience })
    }

    if (projects?.length > 0) {
        sections.push({ id: 'projects', label: 'Projects', icon: Rocket, type: 'projects', items: projects })
    }

    if (education?.length > 0) {
        sections.push({ id: 'education', label: 'Education', icon: GraduationCap, type: 'education', items: education })
    }

    if (hasSkills(skills)) {
        sections.push({ id: 'skills', label: 'Skills', icon: Sparkles, type: 'skills', items: skills })
    }

    if (achievements?.length > 0) {
        sections.push({ id: 'achievements', label: 'Achievements', icon: Award, type: 'achievements', items: achievements })
    }

    if (certifications?.length > 0) {
        sections.push({ id: 'certifications', label: 'Certifications', icon: Award, type: 'certifications', items: certifications })
    }

    if (publications?.length > 0) {
        sections.push({ id: 'publications', label: 'Publications', icon: BookOpen, type: 'publications', items: publications })
    }

    if (volunteering?.length > 0) {
        sections.push({ id: 'volunteering', label: 'Volunteering', icon: Heart, type: 'volunteering', items: volunteering })
    }

    if (extraCurricular?.length > 0) {
        sections.push({ id: 'activities', label: 'Activities', icon: Users, type: 'activities', items: extraCurricular })
    }

    if (references?.length > 0) {
        sections.push({ id: 'references', label: 'References', icon: Users, type: 'references', items: references })
    }

    ;(customSections || [])
        .filter((section) => section.title && section.content)
        .forEach((section, index) => {
            sections.push({
                id: `custom-${index}`,
                label: section.title,
                icon: Code,
                type: 'custom',
                content: section.content,
            })
        })

    if (sections.length === 0 && basicDetails) {
        sections.push({ id: 'about', label: 'About', icon: User, type: 'about-fallback' })
    }

    return sections
}