/**
 * Global Variables and Constants
 */

// Global State Variables
let selectedShape = null; // 当前选中的磁钢形状
let materialDensity = 7.5; // 默认钕铁硼密度 g/cm³
let calculationResults = {}; // 存储计算结果的对象
let currentStep = 1; // 当前步骤编号

// Constants
// 镀层类型对应的预设厚度（单位：μm）
const platingThicknessPresets = {
    'none': 0,
    'phosphating': 2,
    'ni': 5,
    'zn': 10,
    'ni-cu-ni': 20,
    'cuen': 7,
    'epoxy': 15
};

// 磁钢取向描述文本
const orientationText = {
    'axial': '轴向 (Axial) - 厚度方向磁化',
    'radial': '径向 (Radial) - 直径方向磁化',
    'multi-pole': '多极 (Multi-pole) - 复杂磁场分布',
    'diametral': '直径方向 (Diametral) - 环形磁钢专用'
};

// Three.js Global Variables
let scene, camera, renderer, controls;
let currentMagnet = null;
let isWireframeMode = false;
let threeJSInitialized = false;

// Blank Three.js Global Variables
let blankScene, blankCamera, blankRenderer, blankControls;
let currentBlank = null;
let blankThreeJSInitialized = false;
