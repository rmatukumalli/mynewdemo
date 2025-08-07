export async function fetchSkills() {
  const response = await fetch('/api/v1/skills/');
  const skills = await response.json();
  return skills;
}

export function renderSkillsList(skills) {
  const skillsList = document.getElementById('skills-list');
  skillsList.innerHTML = skills
    .map(
      (skill) => `
    <div class="p-4 border rounded shadow">
      <h2 class="text-xl font-bold">${skill.name}</h2>
      <p class="text-gray-600">${skill.category}</p>
    </div>
  `
    )
    .join('');
}

export async function createSkill(skill) {
  const response = await fetch('/api/v1/skills/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(skill),
  });
  const newSkill = await response.json();
  return newSkill;
}

export async function updateSkill(id, skill) {
  const response = await fetch(`/api/v1/skills/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(skill),
  });
  const updatedSkill = await response.json();
  return updatedSkill;
}

export async function deleteSkill(id) {
  await fetch(`/api/v1/skills/${id}`, {
    method: 'DELETE',
  });
}
