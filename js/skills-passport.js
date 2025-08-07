document.addEventListener('DOMContentLoaded', () => {
    function initializeSkillsPassportShell() {
        // console.log("Skills Passport Shell Initialized.");
    }

    initializeSkillsPassportShell();
    setupSkillsPageTabs(); // Initialize tab functionality
});

function setupSkillsPageTabs() {
    const sidebar = document.getElementById('skillsPageSidebar');
    if (!sidebar) {
        console.warn('skillsPageSidebar not found, cannot setup tabs.');
        return;
    }

    const mainTabLinks = Array.from(sidebar.querySelectorAll('a.profile-nav-link[data-main-tab]'));
    const mainContentSections = document.querySelectorAll('.profile-main-content-area > .profile-tab-content');

    async function loadModule(tabContentElement, htmlPath, jsInitFunctionForNonAnalytics) {
        // Prevent reloading if already loaded, unless it's resume-skills (which always re-creates iframe)
        // or if htmlPath is null (should not happen if called correctly).
        if (htmlPath !== 'resume-skills.html' && tabContentElement && tabContentElement.dataset.loaded === 'true' && htmlPath) {
            if (jsInitFunctionForNonAnalytics && typeof window[jsInitFunctionForNonAnalytics] === 'function') {
                // window[jsInitFunctionForNonAnalytics]();
            }
            return;
        }

        try {
            if (htmlPath === 'resume-skills.html') { // Only for resume-skills, which dynamically creates its iframe
                if (!tabContentElement) {
                    console.error('tabContentElement is null for resume-skills.html');
                    return;
                }
                tabContentElement.innerHTML = ''; // Clear previous content
                const iframe = document.createElement('iframe');
                iframe.src = 'resume-skills.html';
                iframe.style.width = '100%';
                const navbarPlaceholder = document.getElementById('main-navbar-placeholder');
                const navbarHeight = navbarPlaceholder ? navbarPlaceholder.offsetHeight : 60;
                iframe.style.height = `calc(100vh - ${navbarHeight}px - 20px)`;
                iframe.style.border = 'none';
                iframe.setAttribute('title', 'Resume-Based Skills Content');
                tabContentElement.appendChild(iframe);
                tabContentElement.dataset.loaded = 'true';
            } else if (htmlPath) { // For other dynamically loaded content (currently none are configured this way)
                if (!tabContentElement) {
                    console.error(`tabContentElement is null for ${htmlPath}`);
                    return;
                }
                if (tabContentElement.dataset.loaded !== 'true') {
                    const response = await fetch(htmlPath);
                    if (!response.ok) {
                        throw new Error(`Failed to load module HTML: ${htmlPath} - ${response.statusText}`);
                    }
                    const fullHtml = await response.text();
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(fullHtml, 'text/html');
                    
                    let contentToLoad = '';
                    const contentElement = doc.querySelector('.profile-section'); 
                    if (contentElement) {
                        contentToLoad = contentElement.innerHTML;
                    } else {
                        const bodyContent = doc.body.innerHTML;
                        const tempDiv = document.createElement('div');
                        tempDiv.innerHTML = bodyContent;
                        const profileSectionInFetched = tempDiv.querySelector('.profile-section');
                        if (profileSectionInFetched) {
                            contentToLoad = profileSectionInFetched.innerHTML;
                        } else {
                            contentToLoad = '<p style="color:red;">Error: Main content section not found in fetched HTML.</p>';
                            console.warn(`'.profile-section' not found in ${htmlPath}, and fallback also failed.`);
                        }
                    }
                    tabContentElement.innerHTML = contentToLoad;
                    tabContentElement.dataset.loaded = 'true';
                }
                if (jsInitFunctionForNonAnalytics && typeof window[jsInitFunctionForNonAnalytics] === 'function') {
                    window[jsInitFunctionForNonAnalytics]();
                }
            }
        } catch (error) {
            console.error(`Error loading module ${htmlPath}:`, error);
            if (tabContentElement) {
                tabContentElement.innerHTML = `<p style="color:red; padding:1em;">Error loading content for this tab: ${error.message}</p>`;
            }
        }
    }

    function resetPageLayout() {
        mainContentSections.forEach(section => {
            if (section) {
                section.style.padding = '';
                section.style.margin = '';
            }
        });

        const profileMainContentArea = document.getElementById('page-content-area');
        if (profileMainContentArea) {
            profileMainContentArea.style.padding = profileMainContentArea.dataset.originalPadding || '';
        }

        const mainPageElement = document.querySelector('main');
        if (mainPageElement) {
            const originalClass = mainPageElement.dataset.originalPaddingClass;
            if (originalClass) { // If we stored a class, ensure it's there
                if (!mainPageElement.classList.contains(originalClass)) {
                    mainPageElement.classList.add(originalClass);
                }
            } else if (!mainPageElement.classList.contains('main-content-padding')) {
                // If no class was stored and it's missing the default, add the default.
                mainPageElement.classList.add('main-content-padding');
            }
            mainPageElement.style.padding = ''; // Reset any inline padding
        }
    }
    
    function applyFullBleedLayout(tabContentAreaElement) {
        if (!tabContentAreaElement) return;

        tabContentAreaElement.style.padding = '0';
        tabContentAreaElement.style.margin = '0';

        const profileMainArea = tabContentAreaElement.closest('.profile-main-content-area');
        if (profileMainArea) {
            if (profileMainArea.style.padding !== '0px' && !profileMainArea.dataset.originalPadding) {
                profileMainArea.dataset.originalPadding = profileMainArea.style.padding;
            }
            profileMainArea.style.padding = '0';
        }

        const mainPageElement = document.querySelector('main');
        if (mainPageElement) {
            if (mainPageElement.classList.contains('main-content-padding') && !mainPageElement.dataset.originalPaddingClass) {
                 mainPageElement.dataset.originalPaddingClass = 'main-content-padding'; // Store the class name
            }
            mainPageElement.classList.remove('main-content-padding');
            mainPageElement.style.padding = '0';
        }
    }

    function activateMainTab(link) {
        if (!link || !link.dataset || !link.dataset.mainTab) {
            console.warn('activateMainTab called with invalid link:', link);
            return;
        }
        const targetMainContentId = link.dataset.mainTab;
        
        resetPageLayout(); 

        mainTabLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        mainContentSections.forEach(section => {
            if(section) {
                section.classList.remove('active');
                section.style.display = 'none';
            }
        });
        
        const targetSection = document.getElementById(targetMainContentId);
        if (targetSection) {
            targetSection.classList.add('active');
            targetSection.style.display = 'block';

            const isResumeSkills = targetMainContentId === 'resume-skills-content';
            const isExistingIframeTab = [
                'skills-overview-content', 
                'certifications-content', 
                'development-plans-content', 
                'skill-history-content', 
                'skill-gap-analysis-content'
            ].includes(targetMainContentId);

            if (isResumeSkills || isExistingIframeTab) {
                applyFullBleedLayout(targetSection);
            }

            if (isResumeSkills) {
                loadModule(targetSection, 'resume-skills.html', null); 
            } else if (isExistingIframeTab) {
                const iframeIdToStyle = `${targetMainContentId.replace('-content', '')}-iframe`;
                const iframeToStyle = document.getElementById(iframeIdToStyle);
                if (iframeToStyle) {
                    const navbarPlaceholder = document.getElementById('main-navbar-placeholder');
                    const navbarHeight = navbarPlaceholder ? navbarPlaceholder.offsetHeight : 60;
                    iframeToStyle.style.height = `calc(100vh - ${navbarHeight}px - 20px)`; 
                    iframeToStyle.style.width = '100%';
                    iframeToStyle.style.border = 'none';
                    targetSection.dataset.loaded = 'true'; 
                } else {
                    console.warn(`Iframe with ID #${iframeIdToStyle} not found for tab ${targetMainContentId}.`);
                }
            } else {
                 // console.log(`Tab ${targetMainContentId} is not an iframe tab and not resume-skills.`);
                 // If this tab had dynamically loaded non-iframe content, call loadModule here.
                 // e.g. loadModule(targetSection, 'some-other-content.html', 'initSomeOtherContent');
            }
        } else {
            console.warn(`Target content section with ID #${targetMainContentId} not found.`);
        }
    }

    sidebar.querySelectorAll('a.profile-nav-link').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            if (this.dataset.mainTab) {
                activateMainTab(this);
            }
        });
    });
    
    const initiallyActiveMainTabLink = sidebar.querySelector('a.profile-nav-link.active[data-main-tab]');
    if (initiallyActiveMainTabLink) {
        activateMainTab(initiallyActiveMainTabLink);
    } else {
        const firstTabLink = sidebar.querySelector('a.profile-nav-link[data-main-tab]');
        if (firstTabLink) {
            activateMainTab(firstTabLink);
        } else {
            console.warn('No tabs found to activate initially.');
        }
    }
}
