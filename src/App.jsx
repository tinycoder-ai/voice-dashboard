import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
  FileText,
  CheckCircle,
  Clock,
  Map,
  ArrowUpRight, 
  ArrowDownRight, 
  CircleUserRound, 
  Mic,
  X 
} from 'lucide-react';
import './index.css';  // 👈 important

// --- Static Data Definitions (Baseline for 30 Days) ---

// Complete list of all 75 Districts of Uttar Pradesh
const UTTAR_PRADESH_DISTRICTS = [
  'Agra', 'Aligarh', 'Ambedkar Nagar', 'Amethi', 'Amroha', 'Auraiya', 
  'Ayodhya (Faizabad)', 'Azamgarh', 'Baghpat', 'Bahraich', 'Ballia', 'Balrampur', 
  'Banda', 'Barabanki', 'Bareilly', 'Basti', 'Bhadohi', 'Bijnor', 'Budaun', 
  'Bulandshahr', 'Chandauli', 'Chitrakoot', 'Deoria', 'Etah', 'Etawah', 
  'Farrukhabad', 'Fatehpur', 'Firozabad', 'Gautam Buddha Nagar (Noida)', 
  'Ghaziabad', 'Ghazipur', 'Gonda', 'Gorakhpur', 'Hamirpur', 'Hapur', 'Hardoi', 
  'Hathras', 'Jalaun', 'Jaunpur', 'Jhansi', 'Kannauj', 'Kanpur Dehat', 
  'Kanpur Nagar', 'Kasganj', 'Kaushambi', 'Kheri (Lakhimpur)', 'Kushinagar', 
  'Lalitpur', 'Lucknow', 'Maharajganj', 'Mahoba', 'Mainpuri', 'Mathura', 'Mau', 
  'Meerut', 'Mirzapur', 'Moradabad', 'Muzaffarnagar', 'Pilibhit', 'Prayagraj (Allahabad)', 
  'Pratapgarh', 'Raebareli', 'Rampur', 'Saharanpur', 'Sambhal', 'Sant Kabir Nagar', 
  'Shahjahanpur', 'Shamli', 'Shrawasti', 'Siddharthnagar', 'Sitapur', 'Sonbhadra', 
  'Sultanpur', 'Unnao', 'Varanasi'
];

/**
 * Base data for all 75 districts, representing a 30-day baseline of service applications.
 * All data points are now objects to prevent NaN errors.
 */
const STATIC_SERVICE_DATA = [
  { name: 'Agra', received: 450, delivered: 390, pending: 60 },
  { name: 'Aligarh', received: 510, delivered: 420, pending: 90 },
  { name: 'Ambedkar Nagar', received: 150, delivered: 135, pending: 15 },
  { name: 'Amethi', received: 180, delivered: 150, pending: 30 },
  { name: 'Amroha', received: 220, delivered: 180, pending: 40 },
  { name: 'Auraiya', received: 110, delivered: 90, pending: 20 },
  { name: 'Ayodhya (Faizabad)', received: 380, delivered: 300, pending: 80 },
  { name: 'Azamgarh', received: 550, delivered: 480, pending: 70 },
  { name: 'Baghpat', received: 130, delivered: 110, pending: 20 },
  { name: 'Bahraich', received: 330, delivered: 280, pending: 50 },
  { name: 'Ballia', received: 270, delivered: 210, pending: 60 },
  { name: 'Balrampur', received: 190, delivered: 150, pending: 40 },
  { name: 'Banda', received: 170, delivered: 140, pending: 30 },
  { name: 'Barabanki', received: 300, delivered: 250, pending: 50 },
  { name: 'Bareilly', received: 480, delivered: 400, pending: 80 },
  { name: 'Basti', received: 230, delivered: 180, pending: 50 },
  { name: 'Bhadohi', received: 140, delivered: 125, pending: 15 },
  { name: 'Bijnor', received: 290, delivered: 240, pending: 50 },
  { name: 'Budaun', received: 210, delivered: 160, pending: 50 },
  { name: 'Bulandshahr', received: 350, delivered: 310, pending: 40 },
  { name: 'Chandauli', received: 160, delivered: 130, pending: 30 },
  { name: 'Chitrakoot', received: 100, delivered: 85, pending: 15 },
  { name: 'Deoria', received: 320, delivered: 270, pending: 50 },
  { name: 'Etah', received: 180, delivered: 150, pending: 30 },
  { name: 'Etawah', received: 250, delivered: 200, pending: 50 },
  { name: 'Farrukhabad', received: 200, delivered: 160, pending: 40 },
  { name: 'Fatehpur', received: 270, delivered: 220, pending: 50 },
  { name: 'Firozabad', received: 310, delivered: 260, pending: 50 },
  { name: 'Gautam Buddha Nagar (Noida)', received: 600, delivered: 550, pending: 50 },
  { name: 'Ghaziabad', received: 580, delivered: 500, pending: 80 },
  { name: 'Ghazipur', received: 280, delivered: 230, pending: 50 },
  { name: 'Gonda', received: 340, delivered: 290, pending: 50 },
  { name: 'Gorakhpur', received: 530, delivered: 460, pending: 70 },
  { name: 'Hamirpur', received: 120, delivered: 100, pending: 20 },
  { name: 'Hapur', received: 240, delivered: 210, pending: 30 },
  { name: 'Hardoi', received: 370, delivered: 310, pending: 60 },
  { name: 'Hathras', received: 190, delivered: 160, pending: 30 },
  { name: 'Jalaun', received: 170, delivered: 140, pending: 30 },
  { name: 'Jaunpur', received: 410, delivered: 350, pending: 60 },
  { name: 'Jhansi', received: 330, delivered: 290, pending: 40 },
  { name: 'Kannauj', received: 150, delivered: 130, pending: 20 },
  { name: 'Kanpur Dehat', received: 220, delivered: 190, pending: 30 },
  { name: 'Kanpur Nagar', received: 590, delivered: 510, pending: 80 },
  { name: 'Kasganj', received: 130, delivered: 110, pending: 20 },
  { name: 'Kaushambi', received: 140, delivered: 115, pending: 25 },
  { name: 'Kheri (Lakhimpur)', received: 380, delivered: 330, pending: 50 },
  { name: 'Kushinagar', received: 260, delivered: 210, pending: 50 },
  { name: 'Lalitpur', received: 160, delivered: 135, pending: 25 },
  { name: 'Lucknow', received: 700, delivered: 620, pending: 80 }, 
  { name: 'Maharajganj', received: 290, delivered: 250, pending: 40 },
  { name: 'Mahoba', received: 110, delivered: 95, pending: 15 },
  { name: 'Mainpuri', received: 200, delivered: 170, pending: 30 },
  { name: 'Mathura', received: 520, delivered: 450, pending: 70 }, 
  { name: 'Mau', received: 210, delivered: 180, pending: 30 },
  { name: 'Meerut', received: 650, delivered: 580, pending: 70 }, 
  { name: 'Mirzapur', received: 250, delivered: 200, pending: 50 },
  { name: 'Moradabad', received: 490, delivered: 420, pending: 70 }, 
  { name: 'Muzaffarnagar', received: 400, delivered: 350, pending: 50 }, 
  { name: 'Pilibhit', received: 190, delivered: 160, pending: 30 },
  { name: 'Prayagraj (Allahabad)', received: 680, delivered: 600, pending: 80 }, 
  { name: 'Pratapgarh', received: 280, delivered: 230, pending: 50 },
  { name: 'Raebareli', received: 310, delivered: 260, pending: 50 },
  { name: 'Rampur', received: 350, delivered: 300, pending: 50 },
  { name: 'Saharanpur', received: 430, delivered: 370, pending: 60 }, 
  { name: 'Sambhal', received: 230, delivered: 190, pending: 40 },
  { name: 'Sant Kabir Nagar', received: 180, delivered: 150, pending: 30 },
  { name: 'Shahjahanpur', received: 320, delivered: 270, pending: 50 },
  { name: 'Shamli', received: 150, delivered: 130, pending: 20 },
  { name: 'Shrawasti', received: 100, delivered: 85, pending: 15 },
  { name: 'Siddharthnagar', received: 210, delivered: 170, pending: 40 },
  { name: 'Sitapur', received: 360, delivered: 300, pending: 60 },
  { name: 'Sonbhadra', received: 240, delivered: 200, pending: 40 },
  { name: 'Sultanpur', received: 300, delivered: 250, pending: 50 },
  { name: 'Unnao', received: 330, delivered: 280, pending: 50 },
  { name: 'Varanasi', received: 620, delivered: 540, pending: 80 } 
];


// --- String Similarity Utilities (Retained for Suggestions ONLY) ---

/**
 * Computes the Levenshtein distance between two strings (minimum number of single-character edits).
 */
const levenshteinDistance = (s1, s2) => {
    // Normalize: lowercase, no special characters/spaces for accurate comparison
    const normalize = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
    s1 = normalize(s1);
    s2 = normalize(s2);

    const costs = [];
    for (let i = 0; i <= s1.length; i++) {
        let lastValue = i;
        for (let j = 0; j <= s2.length; j++) {
            if (i === 0) {
                costs[j] = j;
            } else if (j > 0) {
                let newValue = costs[j - 1];
                if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
                    newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                }
                costs[j - 1] = lastValue;
                lastValue = newValue;
            }
        }
        if (i > 0) costs[s2.length] = lastValue;
    }
    return costs[s2.length];
};

/**
 * Converts Levenshtein distance into a similarity ratio (1.0 = perfect match, 0.0 = completely different).
 */
const getLevenshteinRatio = (s1, s2) => {
    if (!s1 || !s2) return 0;
    const distance = levenshteinDistance(s1, s2);
    return 1 - (distance / Math.max(s1.length, s2.length));
};

/**
 * Finds the top N closest matching district names from the official list for suggestions.
 */
const findBestSuggestions = (inputName, count = 3) => {
    if (!inputName || typeof inputName !== 'string') return [];

    const normalizedInput = inputName.trim().toLowerCase();

    // Calculate scores for all districts
    const scores = UTTAR_PRADESH_DISTRICTS.map(officialName => {
        let score = getLevenshteinRatio(inputName, officialName);
        
        // Boost score for prefix matches
        const normalizedOfficialName = officialName.toLowerCase();
        
        if (normalizedOfficialName.startsWith(normalizedInput)) {
            score = Math.max(score, 0.95);
        } else if (normalizedOfficialName === normalizedInput) {
             score = 1.0;
        }

        return {
            name: officialName,
            score: score 
        };
    });

    // Filter out low scores (less than 50% similarity) and sort by score descending
    return scores
        .filter(s => s.score >= 0.5)
        .sort((a, b) => b.score - a.score)
        .slice(0, count)
        .map(s => s.name);
};


// --- Dashboard Data Logic ---

/**
 * Generates and optionally filters service data based on a time-frame and selected district.
 * @param {number} days - The number of days to generate data for.
 * @param {string | null} selectedDistrict - The district to filter by, or null for all districts.
 */
const generateServiceData = (days, selectedDistrict) => {
  let totalReceived = 0;
  let totalDelivered = 0;
  let totalPending = 0;
  
  // Scale factor based on a 30-day baseline
  const scale = days / 30; 

  // Step 1: Scale the static data for the given timeframe
  let districtData = STATIC_SERVICE_DATA.map(d => ({
    name: d.name,
    // Scale all values, rounding to the nearest whole number
    received: Math.round(d.received * scale),
    delivered: Math.round(d.delivered * scale),
    pending: Math.round(d.pending * scale),
  }));
  
  // Step 2: Apply district filter if one is selected
  if (selectedDistrict) {
    // Filter the data to include ONLY the matching district
    districtData = districtData.filter(d => d.name === selectedDistrict);
  }

  // Step 3: Calculate totals from the (potentially filtered) data
  districtData.forEach(d => {
    totalReceived += d.received;
    totalDelivered += d.delivered;
    totalPending += d.pending;
  });


  return {
    summary: {
      totalReceived,
      totalDelivered,
      totalPending,
    },
    districtData,
  };
};

// --- Reusable Components ---

/**
 * A card for displaying key statistics.
 */
// function StatCard({ title, value, percentage, icon, trend }) {
//   const IconComponent = icon;
//   const isPositive = trend === 'positive';
//   const TrendIcon = isPositive ? ArrowUpRight : ArrowDownRight;

//   return (
//     <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
//       <div className="flex flex-row items-center justify-between space-y-0 pb-2">
//         <h3 className="text-sm font-medium text-gray-600">{title}</h3>
//         {IconComponent && <IconComponent className="h-5 w-5 text-gray-400" />}
//       </div>
//       <div>
//         <div className="text-3xl font-bold">{value.toLocaleString()}</div>
//         {percentage && (
//           <p className="text-xs text-gray-500 mt-1">
//             <span className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
//               <TrendIcon className="h-4 w-4 mr-1" />
//               {percentage}
//             </span>
//             {isPositive ? 'from last month' : 'from last month'}
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }
function StatCard({ title, value, percentage, icon, trend, timeframe }) {
  const IconComponent = icon;
  const isPositive = trend === 'positive';
  const TrendIcon = isPositive ? ArrowUpRight : ArrowDownRight;

  const getComparisonLabel = () => {
    if (timeframe === 7) return "from last week";
    if (timeframe === 30) return "from last month";
    if (timeframe === 90) return "from last quarter";
    return `from last ${timeframe} days`;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {IconComponent && <IconComponent className="h-5 w-5 text-gray-400" />}
      </div>
      <div>
        <div className="text-3xl font-bold">{value.toLocaleString()}</div>
        {percentage && (
          <p className="text-xs text-gray-500 mt-1">
            <span className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              <TrendIcon className="h-4 w-4 mr-1" />
              {percentage}
            </span>
            {getComparisonLabel()}
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * A component to display the district-wise applications chart.
 */
function DistrictChart({ data, selectedDistrict }) {
  // If a single district is selected, the chart height can be reduced for better viewing
  const chartHeight = selectedDistrict ? 'h-[250px]' : 'h-[750px]';
  const labelHeight = selectedDistrict ? 30 : 70;
  const angle = selectedDistrict ? 0 : -60;
  const fontSize = selectedDistrict ? 12 : 9;
  const textAnchor = selectedDistrict ? 'middle' : 'end';
  
  const title = selectedDistrict 
    ? `Application Status for ${selectedDistrict}`
    : 'District-wise Applications across 75 Districts';

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-gray-500 mb-4">Delivered vs. Pending Applications.</p>
      <div className={`${chartHeight} w-full`}>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={data} 
              layout={selectedDistrict ? 'vertical' : 'horizontal'}
              margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                type={selectedDistrict ? 'number' : 'category'}
                dataKey={selectedDistrict ? null : "name"} 
                stroke="#6b7280" 
                fontSize={fontSize} 
                interval={0} 
                angle={angle} 
                textAnchor={textAnchor} 
                height={labelHeight} 
              />
              <YAxis 
                type={selectedDistrict ? 'category' : 'number'}
                dataKey={selectedDistrict ? 'name' : null}
                stroke="#6b7280" 
                fontSize={12} 
                width={selectedDistrict ? 100 : 60}
              />
              <Tooltip
                formatter={(value, name) => [
                  value.toLocaleString(),
                  name.charAt(0).toUpperCase() + name.slice(1)
                ]}
              />
              <Legend wrapperStyle={{ fontSize: '14px' }} />
              <Bar dataKey="delivered" stackId="a" fill="#22c55e" name="Delivered" />
              <Bar dataKey="pending" stackId="a" fill="#f97316" name="Pending" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No data found for the selected filter.
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * A component to display a list of district-wise application data.
 */
function DistrictWiseTable({ districtData, timeframe, selectedDistrict }) {
  const tableTitle = selectedDistrict 
    ? `Report for ${selectedDistrict}`
    : `District-wise Report (${districtData.length} Districts)`;
    
  // If a single district is selected, show a smaller table
  const maxHeight = selectedDistrict ? 'max-h-[250px]' : 'max-h-[750px]';

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-1">{tableTitle}</h3>
      <p className="text-sm text-gray-500 mb-4">Application status for the last {timeframe} days.</p>
      
      <div className={`space-y-4 ${maxHeight} overflow-y-auto pr-2`}>
        {districtData.length > 0 ? (
          districtData.map((district) => (
            <div key={district.name} className="flex items-center space-x-3 pb-2 border-b border-gray-100 last:border-b-0">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{district.name}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800">{district.received.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Received</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-green-600">{district.delivered.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Delivered</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-orange-600">{district.pending.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Pending</p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 py-10">
            No report data to display.
          </div>
        )}
      </div>
    </div>
  );
}

// --- API Helper ---

/**
 * Calls the Gemini API with exponential backoff for retries.
 */
async function callGeminiApi(userQuery) {
  const systemPrompt = "You are a helpful dashboard assistant for a citizen services dashboard for Uttar Pradesh, India. Your task is to understand a user's natural language query and extract two optional fields: the number of days (days) and a specific district name (districtName) from the list of 75 districts of Uttar Pradesh. You must respond *only* with a valid JSON object matching the provided schema. If a district is not mentioned or the user requests all districts, return null for districtName. If the number of days is unclear, default to 30. Example 1: 'show me applications for Lucknow last 45 days' -> {\"days\": 45, \"districtName\": \"Lucknow\"}. Example 2: 'show me data for last 90 days' -> {\"days\": 90, \"districtName\": null}.";
  
  const schema = {
    type: "OBJECT",
    properties: {
      "days": {
        "type": "NUMBER",
        "description": "The number of days the user wants to see data for. E.g., 'last 30 days' = 30."
      },
      "districtName": {
        "type": "STRING",
        "description": "The specific district name mentioned by the user (e.g., 'Lucknow'). Can be null if not mentioned."
      }
    },
    required: ["days", "districtName"]
  };

  const payload = {
    contents: [{ parts: [{ text: userQuery }] }],
    systemInstruction: {
      parts: [{ text: systemPrompt }]
    },
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: schema
    }
  };

  const apiKey = ""; // Need to use a key generated from Google AI Studio
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

  let retries = 3;
  let delay = 1000;

  while (retries > 0) {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const candidate = result.candidates?.[0];

      if (candidate && candidate.content?.parts?.[0]?.text) {
        // The API returns the JSON as a string, so we need to parse it.
        return JSON.parse(candidate.content.parts[0].text);
      } else {
        throw new Error("Invalid response structure from API.");
      }
    } catch (error) {
      console.warn(`API call failed, retrying... (${retries - 1} left)`);
      retries--;
      if (retries === 0) {
        console.error("API call failed after all retries:", error);
        throw error; // Re-throw the last error
      }
      await new Promise(res => setTimeout(res, delay));
      delay *= 2; // Exponential backoff
    }
  }
}


// --- Main App Component ---

export default function App() {
  const [timeframe, setTimeframe] = useState(30); // Default to 30 days
  const [nlQuery, setNlQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState(null); // State for filtering
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [isListening, setIsListening] = useState(false);

  // Check for browser support on component mount
  const speechRecognitionSupported = useMemo(() => {
    return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
  }, []);

  // Regenerate data when timeframe OR selectedDistrict changes
  const serviceData = useMemo(() => generateServiceData(timeframe, selectedDistrict), [timeframe, selectedDistrict]);

  const { totalReceived, totalDelivered, totalPending } = serviceData.summary;

  const getButtonClasses = (period) => {
    return `px-3 py-1 rounded-md text-sm font-medium transition-colors ${
      timeframe === period
        ? 'bg-gray-900 text-white'
        : 'text-gray-600 hover:bg-gray-100'
    }`;
  };

  // Handles the form's onSubmit event
  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    submitQuery(nlQuery);
  };

  // Logic to handle both text and voice input processing
  const submitQuery = async (queryText) => {
    if (!queryText.trim()) return;

    // Preserve the current timeframe and district selection until processing is complete
    const originalTimeframe = timeframe;
    const originalDistrict = selectedDistrict;

    setIsLoading(true);
    setApiError(null);

    try {
      const result = await callGeminiApi(queryText);
      
      if (!result || typeof result.days !== 'number' || result.days <= 0) {
         throw new Error("Invalid 'days' property in API response.");
      }

      // Update timeframe immediately if valid
      setTimeframe(result.days);
      
      let newDistrict = null;
      let trimmedDistrict = '';

      if (result.districtName) {
        trimmedDistrict = result.districtName.trim();
        
        // 1. Check if the result implies no filter (e.g., "null" string or empty)
        if (trimmedDistrict.toLowerCase() === 'null' || trimmedDistrict === '') {
          newDistrict = null;
        } else {
          // 2. REQUIRE EXACT MATCH (case-insensitive)
          const exactMatch = UTTAR_PRADESH_DISTRICTS.find(
              d => d.toLowerCase() === trimmedDistrict.toLowerCase()
          );

          if (exactMatch) {
            newDistrict = exactMatch;
          } else {
            // 3. NO EXACT MATCH: Generate suggestions and show error
            const suggestions = findBestSuggestions(trimmedDistrict, 3);
            
            const suggestionMessage = suggestions.length > 0 
                ? `District name "**${trimmedDistrict}**" not found. Did you mean: **${suggestions.join('**, **')}**?`
                : `District name "**${trimmedDistrict}**" not found. Please check the spelling.`;

            setApiError(suggestionMessage);
            
            // Revert state to original values since district filter failed
            setTimeframe(originalTimeframe);
            setSelectedDistrict(originalDistrict);

            setIsLoading(false);
            return; // EXIT here to prevent updating selectedDistrict
          }
        }
      }

      // If we reach here, the district was successfully matched or was null/empty (no filter)
      setSelectedDistrict(newDistrict); 
      
      // Clear input field on success
      setNlQuery(""); 

    } catch (error) {
      console.error("Failed to process natural language query:", error);
      setApiError("Sorry, I couldn't understand that query. Please try again.");
      // Revert state on failure
      setTimeframe(originalTimeframe);
      setSelectedDistrict(originalDistrict);
    } finally {
      setIsLoading(false);
    }
  };

  // Handles the microphone button click
  const handleVoiceListen = () => {
    if (isListening) {
      return;
    }

    if (!speechRecognitionSupported) {
      setApiError("Voice recognition is not supported in this browser.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.continuous = false;

    setIsListening(true);
    setApiError(null);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setNlQuery(transcript);
      submitQuery(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setApiError(`Voice error: ${event.error === 'no-speech' ? 'No speech detected.' : event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (error) {
      console.error("Failed to start recognition:", error);
      setApiError("Could not start voice recognition.");
      setIsListening(false);
    }
  };


  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-semibold text-gray-900">
                Citizen Service Dashboard (U.P.)
              </h1>
              {/* Displaying the current filter in the header */}
              <span className="text-xl font-normal ml-3 text-gray-600">
                ({selectedDistrict ? selectedDistrict : 'All Districts'}) - Last {timeframe} Days
              </span>
              {selectedDistrict && (
                <button 
                  onClick={() => setSelectedDistrict(null)}
                  className="px-2 py-1 bg-red-500 text-white text-xs rounded-full hover:bg-red-600 ml-4 transition-colors flex items-center"
                  title="Clear District Filter"
                >
                  Clear <X className="h-3 w-3 ml-1" />
                </button>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                <CircleUserRound className="h-6 w-6 text-gray-500" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Natural Language Input */}
          <div className="mb-6 bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Ask a question (Text or Voice)</h3>
            <form onSubmit={handleQuerySubmit} className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={nlQuery}
                onChange={(e) => setNlQuery(e.target.value)}
                placeholder={isListening ? "Listening..." : "e.g., 'Show me applications for Lucknow last 60 days'"}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                disabled={isLoading || isListening}
              />
              <button
                type="button"
                onClick={handleVoiceListen}
                className={`p-3 text-white rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors
                  ${isListening ? 'bg-red-600 hover:bg-red-700 animate-pulse' : 'bg-gray-900 hover:bg-gray-700'}
                `}
                disabled={isLoading || !speechRecognitionSupported}
              >
                <Mic className="h-5 w-5" />
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={isLoading || isListening}
              >
                {isLoading ? 'Analyzing...' : 'Ask'}
              </button>
            </form>
            {/* Using dangerouslySetInnerHTML to allow bold markdown in error messages */}
            {apiError && (
              <p className="text-sm text-red-600 mt-2" dangerouslySetInnerHTML={{ __html: apiError.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></p>
            )}
            {!speechRecognitionSupported && (
              <p className="text-sm text-gray-500 mt-2">
                Note: Voice recognition is not supported by your browser.
              </p>
            )}
          </div>

          {/* Timeframe Tabs */}
          <div className="flex justify-end mb-4">
            <div className="flex items-center space-x-1 bg-white border border-gray-200 p-1 rounded-lg">
              <span className="text-sm text-gray-600 mr-2">Quick Filters:</span>
              <button onClick={() => { setTimeframe(7); setSelectedDistrict(null); }} className={getButtonClasses(7)}>
                7 Days
              </button>
              <button onClick={() => { setTimeframe(30); setSelectedDistrict(null); }} className={getButtonClasses(30)}>
                30 Days
              </button>
              <button onClick={() => { setTimeframe(90); setSelectedDistrict(null); }} className={getButtonClasses(90)}>
                90 Days
              </button>
            </div>
          </div>

          {/* Stats Cards Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            {/* Note: StatCard values are automatically calculated from the filtered data */}
            <StatCard
              title="Total Applications"
              value={totalReceived}
              percentage="+20.1%"
              icon={FileText}
              trend="positive"
              timeframe={timeframe}
            />
            <StatCard
              title="Services Delivered"
              value={totalDelivered}
              percentage="+18.7%"
              icon={CheckCircle}
              trend="positive"
              timeframe={timeframe}
            />
            <StatCard
              title="Pending Applications"
              value={totalPending}
              percentage="+2.3%"
              icon={Clock}
              trend="negative"
              timeframe={timeframe}
            />
            <StatCard
              title="Districts In View"
              value={selectedDistrict ? 1 : UTTAR_PRADESH_DISTRICTS.length}
              icon={Map}
      
            />
          </div>

          {/* Main Chart and Recent Sales Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <DistrictChart 
                data={serviceData.districtData} 
                selectedDistrict={selectedDistrict}
              />
            </div>
            <div className="lg:col-span-1">
              <DistrictWiseTable 
                districtData={serviceData.districtData} 
                timeframe={timeframe} 
                selectedDistrict={selectedDistrict}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
