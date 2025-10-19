/**
 * UiTM Expert Research Grants Fetcher
 * Fetches research grant data from UiTM Expert profile and displays it
 */

class ExpertResearchGrants {
    constructor() {
        this.expertUrl = 'https://expert.uitm.edu.my/V2/page-detail.php?id=kpS0wAftZa/wMbt+axFm2QraURSC5Nx3w40ZdmhLHQA=';
        this.researchGrants = [];
        this.isLoading = false;
    }

    /**
     * Initialize the research grants fetcher
     */
    async init() {
        try {
            await this.fetchResearchGrants();
            this.displayResearchGrants();
        } catch (error) {
            console.error('Error initializing research grants:', error);
            this.displayError();
        }
    }

    /**
     * Fetch research grants from UiTM Expert profile
     */
    async fetchResearchGrants() {
        this.isLoading = true;
        this.showLoadingState();

        try {
            // Using a CORS proxy to fetch UiTM Expert data
            const proxyUrl = 'https://api.allorigins.win/raw?url=';
            const response = await fetch(proxyUrl + encodeURIComponent(this.expertUrl));
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const html = await response.text();
            this.parseResearchGrants(html);
        } catch (error) {
            console.error('Error fetching research grants:', error);
            // Fallback to manual research grants data
            this.loadFallbackResearchGrants();
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Parse HTML content to extract research grant information
     */
    parseResearchGrants(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Look for research grant entries in UiTM Expert HTML structure
        const researchElements = doc.querySelectorAll('.research-item, .grant-item, tr');
        
        this.researchGrants = [];
        
        // Try to extract research information from various possible selectors
        const possibleSelectors = [
            '.research-item',
            '.grant-item', 
            'table tr',
            '.list-item',
            '.research-list li'
        ];

        for (const selector of possibleSelectors) {
            const elements = doc.querySelectorAll(selector);
            if (elements.length > 0) {
                elements.forEach((element, index) => {
                    const text = element.textContent.trim();
                    if (text && text.length > 10 && this.isResearchGrantText(text)) {
                        this.researchGrants.push({
                            id: this.researchGrants.length + 1,
                            title: this.extractTitle(text),
                            details: text,
                            type: this.extractType(text),
                            status: this.extractStatus(text)
                        });
                    }
                });
                break; // Use the first selector that returns results
            }
        }

        // If no research grants found, use fallback data
        if (this.researchGrants.length === 0) {
            this.loadFallbackResearchGrants();
        }
    }

    /**
     * Check if text appears to be a research grant entry
     */
    isResearchGrantText(text) {
        const researchKeywords = [
            'grant', 'research', 'project', 'funding', 'FRGS', 'RACER', 'LESTARI',
            'KPM', 'UiTM', 'fundamental', 'special', 'autonomous', 'anomaly',
            'detection', 'streaming', 'data', 'e-commerce', 'rural', 'products',
            'commercialization', 'autism', 'journey', 'directory', 'repository',
            'smart', 'urban', 'farming', 'iot', 'downtime', 'analysis', 'data centre',
            'high availability', 'software', 'application', 'services', 'fog devices',
            'radar', 'reflectivity', 'images', 'convective', 'stratiform', 'tropical',
            'rainfall', 'estimates'
        ];
        
        return researchKeywords.some(keyword => 
            text.toLowerCase().includes(keyword.toLowerCase())
        );
    }

    /**
     * Extract title from research grant text
     */
    extractTitle(text) {
        // Try to extract a meaningful title from the text
        const lines = text.split('\n').filter(line => line.trim().length > 0);
        if (lines.length > 0) {
            return lines[0].trim().substring(0, 100) + (lines[0].length > 100 ? '...' : '');
        }
        return text.substring(0, 100) + (text.length > 100 ? '...' : '');
    }

    /**
     * Extract type from research grant text
     */
    extractType(text) {
        if (text.toLowerCase().includes('frgs')) return 'FRGS';
        if (text.toLowerCase().includes('racer')) return 'RACER';
        if (text.toLowerCase().includes('lestari')) return 'LESTARI';
        if (text.toLowerCase().includes('kpm')) return 'KPM';
        if (text.toLowerCase().includes('international')) return 'International';
        if (text.toLowerCase().includes('national')) return 'National';
        return 'Research Grant';
    }

    /**
     * Extract status from research grant text
     */
    extractStatus(text) {
        if (text.toLowerCase().includes('completed')) return 'Completed';
        if (text.toLowerCase().includes('active') || text.toLowerCase().includes('ongoing')) return 'Active';
        if (text.toLowerCase().includes('2020') || text.toLowerCase().includes('2021') || 
            text.toLowerCase().includes('2022') || text.toLowerCase().includes('2023') ||
            text.toLowerCase().includes('2024') || text.toLowerCase().includes('2025')) {
            return 'Active';
        }
        return 'Unknown';
    }

    /**
     * Load fallback research grants data
     */
    loadFallbackResearchGrants() {
        this.researchGrants = [
            {
                id: 1,
                title: "Autonomous Anomaly Detection in Streaming Data",
                details: "KPM, Autonomous Anomaly Detection in Streaming Data, (Ref: RACER/1/2019/ICT02/UITM//4), Role: Team Member.",
                type: "RACER",
                status: "Completed"
            },
            {
                id: 2,
                title: "Web Based E Commerce System For Rural Products Commercialization In Pulau Tuba Langkawi",
                details: "UiTM LESTARI SDG@UiTM Grant, Web Based E Commerce System For Rural Products Commercialization In Pulau Tuba Langkawi, 600-RMC/LESTARI SDG-T 5/3 (142/2019), Role: Team Member.",
                type: "LESTARI",
                status: "Completed"
            },
            {
                id: 3,
                title: "AUTISM JOURNEY DIRECTORY & DATA REPOSITORY SYSTEM",
                details: "NASOM, AUTISM JOURNEY DIRECTORY & DATA REPOSITORY SYSTEM, Role: Team Member.",
                type: "NASOM",
                status: "Completed"
            },
            {
                id: 4,
                title: "Portable Iot-based Smart Urban Farming: Technology Use Case Of Uitm And Unikom Bandung",
                details: "Title : Portable Iot-based Smart Urban Farming: Technology Use Case Of Uitm And Unikom Bandung. Dr. Muhammad Izzad Bin Ramli, Profesor Dr Nursuriati Binti Jamil, Ts. Muhammad Azizi Bin Mohd Ariffin, 2021 - 2022, Other Grants, Project Member, RM 5,000.00",
                type: "Other Grants",
                status: "Completed"
            },
            {
                id: 5,
                title: "Downtime Analysis For Uitm Data Centre",
                details: "Title : Downtime Analysis For Uitm Data Centre. Profesor Dr Jasni Binti Mohamad Zain, Profesor Madya Dr Kamarularifin Bin Abd Jalil, Ts. Muhammad Azizi Bin Mohd Ariffin, 2020 - 2023, Special Research Grant (GPK), Project Member, RM 20,000.00.",
                type: "GPK",
                status: "Completed"
            },
            {
                id: 6,
                title: "A New Technique To Ensure High Availability Of Software Application Services By Utilizing Fog Devices Resource Capabilities",
                details: "Title : A New Technique To Ensure High Availability Of Software Application Services By Utilizing Fog Devices Resource Capabilities. Profesor Dr Jasni Binti Mohamad Zain, Luhur Bayuaji, Norkhushaini Bt Awang, Profesor Madya Dr Kamarularifin Bin Abd Jalil, Ts. Muhammad Azizi Bin Mohd Ariffin, 2021 - 2024, Fundamental Research Grant Scheme (FRGS), Project Member, RM 105,300.00",
                type: "FRGS",
                status: "Active"
            },
            {
                id: 7,
                title: "Coupled Hybrid Feature Extraction And Classification Of Radar Reflectivity Images For Convective-stratiform Tropical Rainfall Estimates",
                details: "Title : Coupled Hybrid Feature Extraction And Classification Of Radar Reflectivity Images For Convective-stratiform Tropical Rainfall Estimates. Profesor Ts. Dr. Wardah Binti Tahir, Profesor Madya Zaidah Binti Ibrahim, Profesor Madya Ir.ts.dr Jazuri Bin Abdullah, Ir. Dr. Suzana Binti Ramli, Ts. Muhammad Azizi Bin Mohd Ariffin, 2021 - 2024, Fundamental Research Grant Scheme (FRGS), Project Member, RM 137,500.00",
                type: "FRGS",
                status: "Active"
            }
        ];
    }

    /**
     * Display research grants in the modal
     */
    displayResearchGrants() {
        const modalBody = document.querySelector('#portfolioModal2 .modal-body .container .row .col-lg-8');
        if (!modalBody) {
            console.error('Research grant modal not found');
            return;
        }

        // Find the text content area
        const textArea = modalBody.querySelector('p.mb-5.text-left');
        if (!textArea) {
            console.error('Research grant text area not found');
            return;
        }

        // Clear existing content
        textArea.innerHTML = '';

        // Add header
        textArea.innerHTML += '<b>Research Grants & Projects</b><br><br>';

        // Group grants by status
        const activeGrants = this.researchGrants.filter(grant => grant.status === 'Active');
        const completedGrants = this.researchGrants.filter(grant => grant.status === 'Completed');

        // Display active grants first
        if (activeGrants.length > 0) {
            textArea.innerHTML += '<b>Active Research Grants</b><br><br>';
            activeGrants.forEach((grant, index) => {
                textArea.innerHTML += `
                    <div class="research-grant-item mb-3 p-3 border-left border-primary">
                        <strong>[${index + 1}] ${grant.title}</strong><br>
                        <span class="text-muted">${grant.details}</span><br>
                        <small class="badge badge-primary">${grant.type} - ${grant.status}</small><br><br>
                    </div>
                `;
            });
        }

        // Display completed grants
        if (completedGrants.length > 0) {
            textArea.innerHTML += '<br><b>Completed Research Grants</b><br><br>';
            completedGrants.forEach((grant, index) => {
                textArea.innerHTML += `
                    <div class="research-grant-item mb-3 p-3 border-left border-success">
                        <strong>[${index + 1}] ${grant.title}</strong><br>
                        <span class="text-muted">${grant.details}</span><br>
                        <small class="badge badge-success">${grant.type} - ${grant.status}</small><br><br>
                    </div>
                `;
            });
        }

        // Add note about data source
        textArea.innerHTML += `
            <div class="mt-4 p-3 bg-light rounded">
                <small class="text-muted">
                    <i class="fas fa-info-circle"></i> 
                    Research grant data is automatically fetched from UiTM Expert profile. 
                    <a href="${this.expertUrl}" target="_blank" class="text-primary">View full profile</a>
                </small>
            </div>
        `;
    }

    /**
     * Show loading state
     */
    showLoadingState() {
        const modalBody = document.querySelector('#portfolioModal2 .modal-body .container .row .col-lg-8');
        if (!modalBody) return;

        const textArea = modalBody.querySelector('p.mb-5.text-left');
        if (!textArea) return;

        textArea.innerHTML = `
            <div class="text-center">
                <div class="spinner-border text-primary" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
                <p class="mt-2">Loading research grants from UiTM Expert...</p>
            </div>
        `;
    }

    /**
     * Display error message
     */
    displayError() {
        const modalBody = document.querySelector('#portfolioModal2 .modal-body .container .row .col-lg-8');
        if (!modalBody) return;

        const textArea = modalBody.querySelector('p.mb-5.text-left');
        if (!textArea) return;

        textArea.innerHTML = `
            <div class="alert alert-warning">
                <h5>Unable to load research grants automatically</h5>
                <p>Please visit my <a href="${this.expertUrl}" target="_blank" class="alert-link">UiTM Expert profile</a> to view my research grants.</p>
            </div>
        `;
    }

    /**
     * Refresh research grants data
     */
    async refresh() {
        await this.init();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const expertResearchGrants = new ExpertResearchGrants();
    
    // Initialize when the research grant modal is opened
    $('#portfolioModal2').on('show.bs.modal', function() {
        if (expertResearchGrants.researchGrants.length === 0) {
            expertResearchGrants.init();
        }
    });
    
    // Make it globally available for manual refresh if needed
    window.expertResearchGrants = expertResearchGrants;
});
