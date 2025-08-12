function selectAspirationalRole(roleName) {
    aspirationalRole = roleName;
    const aspirationalRoleTitleEl = document.getElementById('aspirationalRoleTitle');
    const homeAspirationalRoleEl = document.getElementById('homeAspirationalRole');
    const skillDev1El = document.getElementById('skillDev1');
    const skillDev2El = document.getElementById('skillDev2');
    const skillDev3El = document.getElementById('skillDev3');

    if(aspirationalRoleTitleEl) aspirationalRoleTitleEl.innerText = `for ${roleName}`;
    if(homeAspirationalRoleEl) homeAspirationalRoleEl.innerText = roleName;

    if (skillDev1El && skillDev2El && skillDev3El) {
        if (roleName === 'Engineering Manager') {
            skillDev1El.innerText = 'Strategic Planning';
            skillDev2El.innerText = 'Team Motivation & Coaching';
            skillDev3El.innerText = 'Budget Management';
        } else if (roleName === 'Senior Software Engineer') {
            skillDev1El.innerText = 'Advanced Algorithm Design';
            skillDev2El.innerText = 'System Architecture';
            skillDev3El.innerText = 'Performance Optimization';
        } else {
            skillDev1El.innerText = 'Advanced System Design';
            skillDev2El.innerText = 'Team Leadership';
            skillDev3El.innerText = 'Conflict Resolution';
        }
    }
    navigateTo('screen5');
}

function prepareNewRolePlan(newRole) {
    aspirationalRole = newRole;
    const aspirationalRoleTitleEl = document.getElementById('aspirationalRoleTitle');
    const homeAspirationalRoleEl = document.getElementById('homeAspirationalRole');
    const roleProgressEl = document.getElementById('roleProgress');
    const skillDev1El = document.getElementById('skillDev1');
    const skillDev2El = document.getElementById('skillDev2');
    const skillDev3El = document.getElementById('skillDev3');

    if(aspirationalRoleTitleEl) aspirationalRoleTitleEl.innerText = `for your new role: ${newRole}`;
    if(homeAspirationalRoleEl) homeAspirationalRoleEl.innerText = newRole;
    if(roleProgressEl) roleProgressEl.innerText = '0%';

    if (skillDev1El && skillDev2El && skillDev3El) {
        if (newRole === 'Engineering Manager') {
            skillDev1El.innerText = 'Advanced People Management';
            skillDev2El.innerText = 'Strategic Project Oversight';
            skillDev3El.innerText = 'Cross-functional Collaboration';
        }
    }
    navigateTo('screen5');
}
