document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/ontology_stats')
        .then(response => response.json())
        .then(data => {
            document.getElementById('capabilities-count').textContent = data.capabilities_count;
            document.getElementById('competencies-count').textContent = data.competencies_count;
            document.getElementById('behaviors-count').textContent = data.behaviors_count;
            document.getElementById('skills-count').textContent = data.skills_count;
            document.getElementById('proficiencies-count').textContent = data.proficiencies_count;
        })
        .catch(error => console.error('Error fetching ontology stats:', error));

    fetch('/api/skill_relationship_stats')
        .then(response => response.json())
        .then(data => {
            document.getElementById('skill-relationships-count').textContent = data.skill_relationship_count;
        })
        .catch(error => console.error('Error fetching skill relationship stats:', error));
});
