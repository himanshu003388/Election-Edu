export const roadmapData = [
    {
        id: 1,
        title: "Election Announcement",
        description: "The Election Commission announces the dates. Model Code of Conduct (MCC) comes into effect immediately.",
        icon: "📢"
    },
    {
        id: 2,
        title: "Voter Registration",
        description: "Preparation of electoral rolls. Citizens 18+ can register using Form 6.",
        icon: "📝"
    },
    {
        id: 3,
        title: "Voter List Verification",
        description: "Voters check their names in the electoral roll and download voter slips.",
        icon: "✅"
    },
    {
        id: 4,
        title: "Candidate Nomination",
        description: "Candidates file nomination papers and declare their assets/criminal records.",
        icon: "✍️"
    },
    {
        id: 5,
        title: "Scrutiny & Withdrawal",
        description: "Returning Officer checks nominations. Candidates can withdraw their names.",
        icon: "🔍"
    },
    {
        id: 6,
        title: "Election Campaign",
        description: "Parties rally and campaign. Stops 48 hours before polling starts.",
        icon: "🗣️"
    },
    {
        id: 7,
        title: "Model Code of Conduct",
        description: "Strict rules apply to ensure fair play, prevent bribery, and misuse of power.",
        icon: "⚖️"
    },
    {
        id: 8,
        title: "Voting Day Process",
        description: "Voters visit polling booths, show ID, get inked, and wait for their turn.",
        icon: "🗳️"
    },
    {
        id: 9,
        title: "EVM & VVPAT Process",
        description: "Voters press button on EVM and verify their vote on VVPAT slip.",
        icon: "📠"
    },
    {
        id: 10,
        title: "Vote Counting",
        description: "EVMs are opened under tight security and votes are counted.",
        icon: "🧮"
    },
    {
        id: 11,
        title: "Result Declaration",
        description: "ECI announces winners for each constituency.",
        icon: "🎉"
    },
    {
        id: 12,
        title: "Government Formation",
        description: "The party or coalition with a majority forms the new government.",
        icon: "🏛️"
    }
];

export const checklistData = [
    { id: "eligibility", label: "Check eligibility (18+ and Indian Citizen)" },
    { id: "nvsp", label: "Register on NVSP website (Form 6)" },
    { id: "verify", label: "Verify name in final voter list" },
    { id: "slip", label: "Download digital voter slip" },
    { id: "booth", label: "Find exact polling booth location" },
    { id: "idproof", label: "Keep a valid ID proof ready (Voter ID, Aadhaar, PAN)" },
    { id: "candidate", label: "Research the candidates in your constituency" },
    { id: "nota", label: "Understand the NOTA (None of the Above) option" },
    { id: "vote", label: "Go out, vote, and verify the VVPAT slip" }
];

export const glossaryData = [
    { term: "ECI", definition: "Election Commission of India. The constitutional body responsible for conducting fair elections." },
    { term: "Constituency", definition: "A geographical area that elects one representative to the legislative body." },
    { term: "Voter ID (EPIC)", definition: "Elector's Photo Identity Card. The official ID issued by ECI to eligible voters." },
    { term: "NVSP", definition: "National Voter's Service Portal. The official online platform for voter registration." },
    { term: "EVM", definition: "Electronic Voting Machine. Used to record votes securely and rapidly." },
    { term: "VVPAT", definition: "Voter Verifiable Paper Audit Trail. A slip printed for 7 seconds to let voters verify their EVM vote." },
    { term: "NOTA", definition: "None of the Above. An option allowing voters to reject all candidates in their constituency." },
    { term: "MCC", definition: "Model Code of Conduct. Guidelines for political parties to ensure fair campaigning." },
    { term: "BLO", definition: "Booth Level Officer. A local representative of the ECI who helps with voter registration." },
    { term: "Lok Sabha", definition: "The lower house of India's bicameral Parliament, elected directly by the people." },
    { term: "Rajya Sabha", definition: "The upper house of Parliament, elected indirectly by state legislatures." },
    { term: "By-election", definition: "A special election held to fill a political office that has become vacant between general elections." }
];

export const formsData = [
    {
        id: "form6",
        title: "Form 6",
        purpose: "Application for inclusion of name in the electoral roll.",
        who: "First-time voters or voters shifting to a new constituency.",
        proof: "Age proof (Birth Certificate/Aadhaar) & Address proof (Electricity Bill/Aadhaar)."
    },
    {
        id: "form7",
        title: "Form 7",
        purpose: "Application for objecting inclusion or seeking deletion of name.",
        who: "To delete the name of a deceased person or someone who shifted permanently.",
        proof: "Death certificate or proof of shifting."
    },
    {
        id: "form8",
        title: "Form 8",
        purpose: "Application for correction of details or shifting residence within constituency.",
        who: "Registered voters who need to fix typos, change address, or get a replacement EPIC.",
        proof: "Documentary proof of correct details (e.g., corrected Aadhaar)."
    },
    {
        id: "form6a",
        title: "Form 6A",
        purpose: "Application for inclusion of name in electoral roll by an overseas Indian elector.",
        who: "Non-Resident Indians (NRIs) who have not acquired citizenship of any other country.",
        proof: "Valid Indian Passport with valid visa."
    }
];

export const beginnerSteps = [
    {
        title: "Who can vote?",
        content: "Any Indian citizen who is 18 years or older on the qualifying date (usually Jan 1st of the year) can vote."
    },
    {
        title: "How to register?",
        content: "You can apply online through the NVSP portal or Voter Helpline App by filling out Form 6. You need a photo, age proof, and address proof."
    },
    {
        title: "How to verify?",
        content: "Always check the final electoral roll online before voting day to confirm your name is listed. Without it, you cannot vote."
    },
    {
        title: "Voting Day",
        content: "Go to your assigned booth with an ID. The officer checks your ID, marks your finger with indelible ink, and allows you to use the EVM."
    },
    {
        title: "Results",
        content: "After voting completes nationwide, EVMs are secured. On counting day, votes are tallied and the candidate with the highest votes in a constituency wins."
    }
];
