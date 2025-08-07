mermaid.initialize({ 
    startOnLoad: true,
    securityLevel: 'loose',
    er: {
        width: 1000,
        height: 800,
        layoutDirection: 'TB'
    },
});

// Global functions
function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].classList.remove("active");
    }
    tablinks = document.getElementsByClassName("tab-button");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }
    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
}

// Modal functions
const sampleDataModal = document.getElementById("sampleDataModal");
const modalTableName = document.getElementById("modalTableName");
const modalDataTableContainer = document.getElementById("modalDataTableContainer");

function showSampleData(tableName) {
    modalTableName.textContent = `Sample Data for Table: ${tableName}`;
    modalDataTableContainer.innerHTML = 'Loading...';

    fetch(`/api/sample_data/${tableName}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                modalDataTableContainer.innerHTML = `<p>Error: ${data.error}</p>`;
            } else if (data.data.length === 0) {
                modalDataTableContainer.innerHTML = `<p>No sample data available for table '${tableName}'.</p>`;
            } else {
                let tableHtml = '<table class="modal-data-table"><thead><tr>';
                for (const key in data.data[0]) {
                    tableHtml += `<th>${key}</th>`;
                }
                tableHtml += '</tr></thead><tbody>';

                data.data.forEach(row => {
                    tableHtml += '<tr>';
                    for (const key in row) {
                        tableHtml += `<td>${row[key]}</td>`;
                    }
                    tableHtml += '</tr>';
                });
                tableHtml += '</tbody></table>';
                modalDataTableContainer.innerHTML = tableHtml;
            }
        })
        .catch(error => {
            console.error('Error fetching sample data:', error);
            modalDataTableContainer.innerHTML = `<p>Failed to load data: ${error.message}</p>`;
        });

    sampleDataModal.style.display = "block";
}

function closeModal() {
    sampleDataModal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == sampleDataModal) {
        sampleDataModal.style.display = "none";
    }
}

// Back to Top button functionality
let backToTopBtn = document.getElementById("backToTopBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        backToTopBtn.style.display = "block";
    } else {
        backToTopBtn.style.display = "none";
    }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

// DOMContentLoaded for initial setup and TOC
document.addEventListener("DOMContentLoaded", function() {
    // Set the first tab as active by default
    document.getElementById("schemaDetails").classList.add("active");
    document.getElementsByClassName("tab-button")[0].classList.add("active");

    // Add a note about zooming for the user
    const mermaidDiv = document.querySelector('.mermaid');
    if (mermaidDiv) {
        const zoomNote = document.createElement('p');
        zoomNote.innerHTML = '<em>Tip: Use Ctrl/Cmd + mouse wheel to zoom in/out on the diagram, and click-and-drag to pan.</em>';
        mermaidDiv.parentNode.insertBefore(zoomNote, mermaidDiv.nextSibling);
    }

    // Table of Contents sidebar functionality
    const tocList = document.getElementById('table-of-contents-list');
    const tableSections = document.querySelectorAll('#schemaDetails .table-section');
    let firstTableId = '';

    tableSections.forEach((section, index) => {
        const tableNameElement = section.querySelector('h3 code');
        if (tableNameElement) {
            const tableName = tableNameElement.textContent;
            const tableId = section.id;

            if (index === 0) {
                firstTableId = tableId;
            }

            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = `#${tableId}`; // Use hash for navigation
            link.textContent = tableName;
            link.setAttribute('data-table-id', tableId);
            link.addEventListener('click', function(event) {
                event.preventDefault();
                displayTable(this.getAttribute('data-table-id'));
            });
            listItem.appendChild(link);
            tocList.appendChild(listItem);
        }
    });

    function displayTable(tableId) {
        tableSections.forEach(section => {
            section.style.display = 'none';
            section.classList.remove('highlight');
        });

        const targetTable = document.getElementById(tableId);
        if (targetTable) {
            targetTable.style.display = 'block';
            targetTable.classList.add('highlight');
            targetTable.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        // Update active class for sidebar links
        const sidebarLinks = document.querySelectorAll('.sidebar-toc ul li a');
        sidebarLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-table-id') === tableId) {
                link.classList.add('active');
            }
        });

        // Update URL hash
        window.history.replaceState(null, '', `#${tableId}`);
    }

    // Handle initial load based on URL hash or show first table
    function handleHashChange() {
        const hash = window.location.hash.substring(1);
        if (hash) {
            const targetTable = document.getElementById(hash);
            if (targetTable) {
                displayTable(hash);
            } else if (firstTableId) {
                displayTable(firstTableId);
            }
        } else if (firstTableId) {
            displayTable(firstTableId);
        }
    }

    // Listen for hash changes (e.g., browser back/forward)
    window.addEventListener('hashchange', handleHashChange);

    // Call on initial load
    handleHashChange();
});
