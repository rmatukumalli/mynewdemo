import { DEFAULT_REQUIRED_SKILL_LEVEL } from './constants.js';

// --- TAG INPUT LOGIC ---
export function setupTagInput(containerEl, inputEl) {
    inputEl.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.key === ',') {
            event.preventDefault();
            const skillName = inputEl.value.trim();
            if (skillName) {
                addTagToContainer(skillName, containerEl);
                inputEl.value = '';
            }
        }
    });
}

export function addTagToContainer(skillName, containerEl) {
    const existingTags = Array.from(containerEl.querySelectorAll('.tag span:first-child')).map(span => span.textContent.toLowerCase());
    if (existingTags.includes(skillName.toLowerCase())) return;

    const tag = document.createElement('span');
    tag.className = 'tag bg-slate-100 text-slate-600'; // Updated to slate theme

    const skillText = document.createElement('span');
    skillText.textContent = skillName;
    tag.appendChild(skillText);

    const removeBtn = document.createElement('span');
    removeBtn.className = 'tag-remove';
    removeBtn.innerHTML = '&times;';
    removeBtn.onclick = () => containerEl.removeChild(tag);
    tag.appendChild(removeBtn);
    containerEl.insertBefore(tag, containerEl.querySelector('input'));
}

export function getTagsFromContainer(containerEl) {
    return Array.from(containerEl.querySelectorAll('.tag span:first-child')).map(span => span.textContent);
}

// --- CANDIDATE MATCHING & DISPLAY LOGIC ---
export function calculateMatch(employee, criteria) {
    let score = 0;
    let matchedSkills = [];
    let missingSkills = [];

    const employeeSkillNames = employee.skills.map(s => s.name.toLowerCase());
    const employeeSkillMap = new Map(employee.skills.map(s => [s.name.toLowerCase(), s.level]));

    const requiredRoleSkills = [
        ...(criteria.hardSkills || []).map(name => ({ name, level: DEFAULT_REQUIRED_SKILL_LEVEL, importance: 'Hard' })),
        ...(criteria.softSkills || []).map(name => ({ name, level: DEFAULT_REQUIRED_SKILL_LEVEL, importance: 'Soft' }))
    ];

    let totalSkillValue = 0;
    let achievedSkillValue = 0;

    requiredRoleSkills.forEach(roleSkill => {
        totalSkillValue += roleSkill.level;
        const empSkillLevel = employeeSkillMap.get(roleSkill.name.toLowerCase());

        if (empSkillLevel !== undefined) {
            matchedSkills.push(roleSkill.name);
            achievedSkillValue += Math.min(empSkillLevel, roleSkill.level);
        } else {
            missingSkills.push(roleSkill.name);
        }
    });

    const skillScore = totalSkillValue > 0 ? (achievedSkillValue / totalSkillValue) * 100 : (requiredRoleSkills.length === 0 ? 100 : 0);
    score = skillScore * 0.7;

    if (employee.experience >= criteria.experience) {
        score += 30;
    } else if (criteria.experience > 0) {
        score += (employee.experience / criteria.experience) * 30;
    } else {
        score +=30;
    }

    return {
        ...employee,
        matchScore: Math.min(100, Math.round(score)),
        matchedSkills,
        missingSkills
    };
}

export function sortCandidates(candidates, sortBy) {
    return [...candidates].sort((a, b) => {
        switch (sortBy) {
            case 'matchScoreAsc': return a.matchScore - b.matchScore;
            case 'nameAsc': return a.name.localeCompare(b.name);
            case 'experienceDesc': return b.experience - a.experience;
            case 'matchScoreDesc':
            default:
                return b.matchScore - a.matchScore;
        }
    });
}
