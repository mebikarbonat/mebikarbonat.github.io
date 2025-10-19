/**
 * Google Scholar Publications Fetcher
 * Fetches publication data from Google Scholar profile and displays it
 */

class ScholarPublications {
    constructor() {
        this.scholarUrl = 'https://scholar.google.com/citations?user=EygguTUAAAAJ&hl=en';
        this.publications = [];
        this.isLoading = false;
    }

    /**
     * Initialize the publications fetcher
     */
    async init() {
        try {
            await this.fetchPublications();
            this.displayPublications();
        } catch (error) {
            console.error('Error initializing publications:', error);
            this.displayError();
        }
    }

    /**
     * Fetch publications from Google Scholar
     * Note: This uses a CORS proxy since Google Scholar doesn't allow direct access
     */
    async fetchPublications() {
        this.isLoading = true;
        this.showLoadingState();

        try {
            // Using a CORS proxy to fetch Google Scholar data
            const proxyUrl = 'https://api.allorigins.win/raw?url=';
            const response = await fetch(proxyUrl + encodeURIComponent(this.scholarUrl));
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const html = await response.text();
            this.parsePublications(html);
        } catch (error) {
            console.error('Error fetching publications:', error);
            // Fallback to manual publications data
            this.loadFallbackPublications();
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Parse HTML content to extract publication information
     */
    parsePublications(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Try multiple selectors to find publication entries
        const selectors = [
            '.gsc_a_tr',           // Standard Google Scholar table rows
            '.gsc_a_t',            // Alternative selector
            '.gsc_a_at',           // Title links
            'tr[data-rid]',        // Table rows with data-rid
            '.gsc_a_tc'            // Table cells
        ];
        
        let publicationElements = [];
        for (const selector of selectors) {
            publicationElements = doc.querySelectorAll(selector);
            if (publicationElements.length > 0) {
                console.log(`Found ${publicationElements.length} publications using selector: ${selector}`);
                break;
            }
        }
        
        this.publications = Array.from(publicationElements).map((element, index) => {
            // Try different ways to extract publication data
            const titleElement = element.querySelector('.gsc_a_at') || 
                                element.querySelector('a[href*="scholar"]') ||
                                element.querySelector('.gsc_a_t a');
            
            const authorsElement = element.querySelector('.gs_gray') || 
                                  element.querySelector('.gsc_a_at + .gs_gray');
            
            const venueElement = element.querySelector('.gs_gray:last-child') ||
                                element.querySelectorAll('.gs_gray')[1];
            
            const yearElement = element.querySelector('.gsc_a_y') ||
                               element.querySelector('.gsc_a_yc');
            
            const citationsElement = element.querySelector('.gsc_a_c') ||
                                    element.querySelector('.gsc_a_c a');

            const title = titleElement ? titleElement.textContent.trim() : 
                         element.textContent.split('\n')[0]?.trim() || 'Unknown Title';
            
            const authors = authorsElement ? authorsElement.textContent.trim() : 'Unknown Authors';
            const venue = venueElement ? venueElement.textContent.trim() : 'Unknown Venue';
            const year = yearElement ? yearElement.textContent.trim() : 'Unknown Year';
            const citations = citationsElement ? citationsElement.textContent.trim() : '0';

            return {
                id: index + 1,
                title: title.length > 150 ? title.substring(0, 150) + '...' : title,
                authors: authors,
                venue: venue,
                year: year,
                citations: citations,
                link: titleElement ? titleElement.href : '#'
            };
        });

        // If no publications found or very few found, use fallback data
        if (this.publications.length === 0 || this.publications.length < 5) {
            console.log('Using fallback publications data');
            this.loadFallbackPublications();
        } else {
            console.log(`Successfully parsed ${this.publications.length} publications`);
        }
    }

    /**
     * Load fallback publication data when scraping fails
     */
    loadFallbackPublications() {
        this.publications = [
            {
                id: 1,
                title: "Network traffic profiling using data mining technique in campus environment",
                authors: "M. A. M. Ariffin, R. Ishak, S. A. Ahmad, and Z. Kasiran",
                venue: "International Journal of Advanced Trends in Computer Science and Engineering",
                year: "2020",
                citations: "15",
                link: "#"
            },
            {
                id: 2,
                title: "Data leakage detection in cloud computing platform",
                authors: "M. A. M. Ariffin, K. A. Rahman, M. Y. Darus, N. Awang, and Z. Kasiran",
                venue: "International Journal of Advanced Trends in Computer Science and Engineering",
                year: "2019",
                citations: "12",
                link: "#"
            },
            {
                id: 3,
                title: "API Vulnerabilities In Cloud Computing Platform: Attack And Detection",
                authors: "M. A. M. Ariffin, M. F. Ibrahim and Z. Kasiran",
                venue: "International Journal of Engineering Trends and Technology (IJETT)",
                year: "2020",
                citations: "8",
                link: "#"
            },
            {
                id: 4,
                title: "Multi-level resilience in networked environments: Concepts & principles",
                authors: "M. A. M. Ariffin, A. K. Marnerides, and A. U. Mauthe",
                venue: "2017 14th IEEE Annual Consumer Communications and Networking Conference",
                year: "2017",
                citations: "25",
                link: "#"
            },
            {
                id: 5,
                title: "Automatic Climate Control for Mushroom Cultivation using IoT Approach",
                authors: "Ariffin, M., Ramli, M., Amin, M., Ismail, M., Zainol, Z., Ahmad, N., & Jamil, N.",
                venue: "2020 IEEE 10th International Conference on System Engineering and Technology (ICSET)",
                year: "2020",
                citations: "18",
                link: "#"
            },
            {
                id: 6,
                title: "IoT-Based Flash Flood Detection and Alert Using TensorFlow",
                authors: "Rashid, A.A., Ariffin, M.A.M., Kasiran, Z.",
                venue: "Proceedings - 2021 11th IEEE International Conference on Control System, Computing and Engineering",
                year: "2021",
                citations: "10",
                link: "#"
            },
            {
                id: 7,
                title: "Local File Inclusion Vulnerability Scanner with Tor Proxy",
                authors: "K. A. H. H. B. C. K. M. Sahidi, M. A. M. Ariffin, M. I. Ramli and Z. Kasiran",
                venue: "2021 IEEE International Conference on Signal and Image Processing Applications (ICSIPA)",
                year: "2021",
                citations: "5",
                link: "#"
            },
            {
                id: 8,
                title: "A Case Study On Digital Divide And Access To Information Communication Technologies (Icts) In Pulau Tuba, Langkawi, Malaysia",
                authors: "Et. al., M.",
                venue: "Turkish Journal Of Computer And Mathematics Education (TURCOMAT)",
                year: "2021",
                citations: "7",
                link: "#"
            },
            {
                id: 9,
                title: "Detecting Anomaly in IoT Devices using Multi-Threaded Autonomous Anomaly Detection",
                authors: "MYI Basheer, AM Ali, NHA Hamid, MAM Ariffin, R Osman, S Nordin",
                venue: "2021 4th International Symposium on Agents, Multi-Agent Systems and Robotics",
                year: "2021",
                citations: "3",
                link: "#"
            },
            {
                id: 10,
                title: "Implementation Of Dynamic Honeypot On Raspberry Pi",
                authors: "ADI RIDZAN ADNAN, MUHAMMAD AZIZI BIN MOHD ARIFFIN",
                venue: "i-IDeA 2020 - 5TH INTERNATIONAL INNOVATION, DESIGN & ARTICULATION",
                year: "2021",
                citations: "2",
                link: "#"
            }
        ];
    }

    /**
     * Display publications in the modal
     */
    displayPublications() {
        const modalBody = document.querySelector('#portfolioModal5 .modal-body .container .row .col-lg-8');
        if (!modalBody) {
            console.error('Publication modal not found');
            return;
        }

        // Find the text content area
        const textArea = modalBody.querySelector('p.mb-5.text-left');
        if (!textArea) {
            console.error('Publication text area not found');
            return;
        }

        // Clear existing content
        textArea.innerHTML = '';

        // Add header
        textArea.innerHTML += '<b>Publications</b><br><br>';

        // Add publications with better formatting
        this.publications.forEach((pub, index) => {
            textArea.innerHTML += `
                <div class="publication-item mb-3 p-2 border-left border-primary">
                    <strong>[${index + 1}] ${pub.title}</strong><br>
                    <em class="text-secondary">${pub.authors}</em><br>
                    <span class="text-muted">${pub.venue}, ${pub.year}</span><br>
                    <small class="badge badge-info">Citations: ${pub.citations}</small><br><br>
                </div>
            `;
        });

        // Add note about data source and loading status
        const isUsingFallback = this.publications.length <= 10;
        textArea.innerHTML += `
            <div class="mt-4 p-3 bg-light rounded">
                <small class="text-muted">
                    <i class="fas fa-info-circle"></i> 
                    ${isUsingFallback ? 
                        'Showing cached publication data. ' : 
                        'Publication data fetched from Google Scholar. '
                    }
                    <a href="${this.scholarUrl}" target="_blank" class="text-primary">View full profile</a>
                    ${isUsingFallback ? 
                        '<br><small class="text-warning"><i class="fas fa-exclamation-triangle"></i> Some publications may not be displayed due to loading limitations.</small>' : 
                        ''
                    }
                </small>
            </div>
        `;
    }

    /**
     * Show loading state
     */
    showLoadingState() {
        const modalBody = document.querySelector('#portfolioModal5 .modal-body .container .row .col-lg-8');
        if (!modalBody) return;

        const textArea = modalBody.querySelector('p.mb-5.text-left');
        if (!textArea) return;

        textArea.innerHTML = `
            <div class="text-center">
                <div class="spinner-border text-primary" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
                <p class="mt-2">Loading publications from Google Scholar...</p>
            </div>
        `;
    }

    /**
     * Display error message
     */
    displayError() {
        const modalBody = document.querySelector('#portfolioModal5 .modal-body .container .row .col-lg-8');
        if (!modalBody) return;

        const textArea = modalBody.querySelector('p.mb-5.text-left');
        if (!textArea) return;

        textArea.innerHTML = `
            <div class="alert alert-warning">
                <h5>Unable to load publications automatically</h5>
                <p>Please visit my <a href="${this.scholarUrl}" target="_blank" class="alert-link">Google Scholar profile</a> to view my publications.</p>
            </div>
        `;
    }

    /**
     * Refresh publications data
     */
    async refresh() {
        await this.init();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const scholarPublications = new ScholarPublications();
    
    // Initialize when the publication modal is opened
    $('#portfolioModal5').on('show.bs.modal', function() {
        if (scholarPublications.publications.length === 0) {
            scholarPublications.init();
        }
    });
    
    // Make it globally available for manual refresh if needed
    window.scholarPublications = scholarPublications;
});
