export const MOCK_ANALYSES = {
  change_detection: {
    id: "SQ-CD-001",
    task: "change_detection",
    taskLabel: "CHANGE DETECTION",
    status: "COMPLETE",
    answer: "Significant urban expansion detected between the 2018 and 2024 captures. Built-up area increased by approximately 18.4 hectares (from 42.6 ha to 61.0 ha), primarily in the southeastern quadrant. Three new construction zones are visible with cleared earth and foundation structures. Water-covered area remained stable at 12.3 ha.",
    confidence: {
      modelConfidence: "HIGH",
      evidenceStrength: "HIGH",
      crossModalAgreement: "+11 dB"
    },
    evidence: {
      summary: "Multi-temporal comparison confirms 18.4 ha built-up increase; three new construction zones identified.",
      metrics: [
        { label: "Built-up (2018)", value: "42.6 ha" },
        { label: "Built-up (2024)", value: "61.0 ha" },
        { label: "Change", value: "+18.4 ha (+43.2%)" },
        { label: "Water area", value: "12.3 ha (stable)" },
        { label: "New zones", value: "3 detected" }
      ]
    },
    regions: [
      { id: "r1", label: "New construction zone A", type: "construction", confidence: 0.94, bbox: [120, 340, 180, 410] },
      { id: "r2", label: "New construction zone B", type: "construction", confidence: 0.91, bbox: [210, 280, 270, 350] },
      { id: "r3", label: "New construction zone C", type: "construction", confidence: 0.89, bbox: [300, 390, 370, 460] },
      { id: "r4", label: "Stable water body", type: "water", confidence: 0.97, bbox: [50, 120, 140, 200] }
    ],
    executionTrace: [
      { step: 1, title: "Query parsing", duration: "0.12s", status: "completed" },
      { step: 2, title: "Image alignment", duration: "0.45s", status: "completed" },
      { step: 3, title: "Change detection", duration: "1.8s", status: "completed" },
      { step: 4, title: "Evidence extraction", duration: "0.55s", status: "completed" },
      { step: 5, title: "Response synthesis", duration: "0.32s", status: "completed" }
    ],
    model: "SatQuery RS-VLM",
    tool: "Change Detection",
    processingTime: "3.24s",
    mode: "before_after",
    query: "What changed between these two dates? Has the built-up area increased?",
    createdAt: "2026-09-28T10:15:00.000Z"
  },

  vqa: {
    id: "SQ-VQA-001",
    task: "vqa",
    taskLabel: "VISUAL QUESTION ANSWERING",
    status: "COMPLETE",
    answer: "The image shows a mixed land-cover scene dominated by built-up residential blocks (approximately 35% of the scene), with interspersed agricultural plots (22%), open water bodies (18%), and sparse tree cover (15%). A major roadway intersects the northern sector, and two small industrial structures are visible near the eastern edge.",
    confidence: {
      modelConfidence: "HIGH",
      evidenceStrength: "HIGH",
      crossModalAgreement: "+9 dB"
    },
    evidence: {
      summary: "Scene classification confirms 35% built-up, 22% agriculture, 18% water, 15% vegetation.",
      metrics: [
        { label: "Built-up", value: "35%" },
        { label: "Agriculture", value: "22%" },
        { label: "Water", value: "18%" },
        { label: "Vegetation", value: "15%" },
        { label: "Road / Bare", value: "10%" }
      ]
    },
    regions: [
      { id: "r1", label: "Residential block north", type: "built-up", confidence: 0.93, bbox: [60, 120, 220, 280] },
      { id: "r2", label: "Agricultural plot center", type: "agriculture", confidence: 0.91, bbox: [230, 200, 380, 330] },
      { id: "r3", label: "Water body east", type: "water", confidence: 0.96, bbox: [390, 140, 460, 220] }
    ],
    executionTrace: [
      { step: 1, title: "Query parsing", duration: "0.10s", status: "completed" },
      { step: 2, title: "Visual encoding", duration: "0.85s", status: "completed" },
      { step: 3, title: "Answer synthesis", duration: "0.30s", status: "completed" }
    ],
    model: "SatQuery RS-VLM",
    tool: "Visual Q&A",
    processingTime: "1.25s",
    mode: "single",
    query: "Describe the land-cover and major objects visible in this image.",
    createdAt: "2026-09-28T11:00:00.000Z"
  },

  optical_sar: {
    id: "SQ-OS-001",
    task: "optical_sar",
    taskLabel: "OPTICAL + SAR FUSION",
    status: "COMPLETE",
    answer: "Fusion of Sentinel-2 MSI (optical) and Sentinel-1 C-Band SAR confirms a built-up corridor running NW-SE across the scene center. Optical bands show vegetation health (NDVI ~0.42) in surrounding areas, while SAR backscatter (+11 dB contrast) highlights structural facades and surface roughness differences. Cloud cover is <2%, allowing full optical clarity.",
    confidence: {
      modelConfidence: "HIGH",
      evidenceStrength: "HIGH",
      crossModalAgreement: "+11 dB"
    },
    evidence: {
      summary: "Optical + SAR fusion confirms built-up corridor with high cross-modal agreement.",
      metrics: [
        { label: "NDVI (vegetation)", value: "0.42" },
        { label: "SAR contrast", value: "+11 dB" },
        { label: "Cloud cover", value: "<2%" },
        { label: "Built-up corridor length", value: "2.3 km" }
      ]
    },
    regions: [
      { id: "r1", label: "Built-up corridor NW", type: "built-up", confidence: 0.94, bbox: [80, 100, 250, 260] },
      { id: "r2", label: "Built-up corridor SE", type: "built-up", confidence: 0.92, bbox: [260, 250, 420, 400] },
      { id: "r3", label: "Healthy vegetation zone", type: "vegetation", confidence: 0.89, bbox: [30, 300, 120, 420] }
    ],
    executionTrace: [
      { step: 1, title: "Query parsing", duration: "0.10s", status: "completed" },
      { step: 2, title: "Optical encoding", duration: "0.70s", status: "completed" },
      { step: 3, title: "SAR encoding", duration: "0.65s", status: "completed" },
      { step: 4, title: "Cross-modal fusion", duration: "1.2s", status: "completed" },
      { step: 5, title: "Response synthesis", duration: "0.35s", status: "completed" }
    ],
    model: "SatQuery RS-VLM",
    tool: "Optical + SAR Fusion",
    processingTime: "3.0s",
    mode: "optical_sar",
    query: "Use the optical and SAR images together to identify built-up and water-covered regions.",
    createdAt: "2026-09-28T09:30:00.000Z"
  },

  grounding: {
    id: "SQ-GR-001",
    task: "grounding",
    taskLabel: "SPATIAL GROUNDING",
    status: "COMPLETE",
    answer: "The highlighted container vessel is located in the eastern quadrant at approximate lat/lon offset 1.4 km from scene center (bbox: [310, 240, 390, 310]). It measures 240.5 m in length with an estimated beam of 32.2 m, classified as Panamax-class. The primary evidence overlay confirms the vessel's orientation is NE-SW along Quay 2.",
    confidence: {
      modelConfidence: "HIGH",
      evidenceStrength: "HIGH",
      crossModalAgreement: "+10 dB"
    },
    evidence: {
      summary: "Vessel detected in eastern quadrant; 240.5 m length, Panamax-class.",
      metrics: [
        { label: "Length", value: "240.5 m" },
        { label: "Beam", value: "32.2 m" },
        { label: "Class", value: "Panamax" },
        { label: "Location", value: "E quadrant" },
        { label: "Offset from center", value: "~1.4 km" }
      ]
    },
    regions: [
      { id: "r1", label: "Container vessel (Quay 2)", type: "vessel", confidence: 0.96, bbox: [310, 240, 390, 310] },
      { id: "r2", label: "Quay infrastructure", type: "structure", confidence: 0.91, bbox: [280, 200, 420, 240] }
    ],
    executionTrace: [
      { step: 1, title: "Query parsing", duration: "0.10s", status: "completed" },
      { step: 2, title: "Entity detection", duration: "0.95s", status: "completed" },
      { step: 3, title: "Spatial grounding", duration: "0.60s", status: "completed" },
      { step: 4, title: "Evidence bounding", duration: "0.40s", status: "completed" },
      { step: 5, title: "Response synthesis", duration: "0.30s", status: "completed" }
    ],
    model: "SatQuery RS-VLM",
    tool: "Spatial Grounding",
    processingTime: "2.35s",
    mode: "single",
    query: "Highlight the largest vessel along Quay 2 and provide its dimensions and location.",
    createdAt: "2026-09-28T08:45:00.000Z"
  }
};
