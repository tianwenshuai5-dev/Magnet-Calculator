/**
 * DOM Elements Reference
 */
const shapeCards = document.querySelectorAll('.shape-card');
const nextToStep2Btn = document.getElementById('next-to-step-2');
const backToStep1Btn = document.getElementById('back-to-step-1');
const backToStep2Btn = document.getElementById('back-to-step-2');
const restartCalculationBtn = document.getElementById('restart-calculation');
const recalculateResultBtn = document.getElementById('recalculate-result');
const printResultBtn = document.getElementById('print-result');
const exportResultBtn = document.getElementById('export-result');
const tabButtons = document.querySelectorAll('.tab-button');
const calculateResultBtn = document.getElementById('calculate-result-btn');

// Step Content Containers
const step1 = document.getElementById('step-1');
const step2 = document.getElementById('step-2');
const step3 = document.getElementById('step-3');

// Shape Parameters Forms
const shapeParams = document.querySelectorAll('.shape-params');

// Step Indicators
const stepIndicators = document.querySelectorAll('.step-indicator');

// Tab Contents
const tabContents = document.querySelectorAll('.tab-content');

/**
 * Page Initialization
 */
document.addEventListener('DOMContentLoaded', function () {
    /**
     * Update Machining Allowance Defaults
     */
    function updateMachiningAllowanceDefaults() {
        const lengthOutputCount = parseInt(document.getElementById('length-output-count').value);
        const widthOutputCount = parseInt(document.getElementById('width-output-count').value);
        const thicknessOutputCount = parseInt(document.getElementById('thickness-output-count').value);

        const lengthMachiningAllowance = document.getElementById('length-machining-allowance');
        const widthMachiningAllowance = document.getElementById('width-machining-allowance');
        const thicknessMachiningAllowance = document.getElementById('thickness-machining-allowance');

        // When output count is 1, default allowance is 0.7, otherwise 1.7
        lengthMachiningAllowance.value = lengthOutputCount === 1 ? 0.7 : 1.7;
        widthMachiningAllowance.value = widthOutputCount === 1 ? 0.7 : 1.7;
        thicknessMachiningAllowance.value = thicknessOutputCount === 1 ? 0.7 : 1.7;
    }

    function updateMachiningAllowanceDefaultsForShape(shape) {
        if (shape === 'circle') {
            const diameterOutputCount = parseInt(document.getElementById('circle-diameter-output-count').value);
            const circleThicknessOutputCount = parseInt(document.getElementById('circle-thickness-output-count').value);
            const heightOutputCount = parseInt(document.getElementById('circle-height-output-count').value);

            const diameterMachiningAllowance = document.getElementById('circle-diameter-machining-allowance');
            const circleThicknessMachiningAllowance = document.getElementById('circle-thickness-machining-allowance');
            const heightMachiningAllowance = document.getElementById('circle-height-machining-allowance');

            diameterMachiningAllowance.value = diameterOutputCount === 1 ? 0.7 : 1.7;
            circleThicknessMachiningAllowance.value = circleThicknessOutputCount === 1 ? 0.7 : 1.7;
            heightMachiningAllowance.value = heightOutputCount === 1 ? 0.7 : 1.7;
        } else if (shape === 'ring') {
            const outerDiameterOutputCount = parseInt(document.getElementById('ring-outer-diameter-output-count').value);
            const innerDiameterOutputCount = parseInt(document.getElementById('ring-inner-diameter-output-count').value);
            const ringThicknessOutputCount = parseInt(document.getElementById('ring-thickness-output-count').value);

            const outerDiameterMachiningAllowance = document.getElementById('ring-outer-diameter-machining-allowance');
            const innerDiameterMachiningAllowance = document.getElementById('ring-inner-diameter-machining-allowance');
            const ringThicknessMachiningAllowance = document.getElementById('ring-thickness-machining-allowance');

            outerDiameterMachiningAllowance.value = outerDiameterOutputCount === 1 ? 0.7 : 1.7;
            innerDiameterMachiningAllowance.value = innerDiameterOutputCount === 1 ? 0.7 : 1.7;
            ringThicknessMachiningAllowance.value = ringThicknessOutputCount === 1 ? 0.7 : 1.7;
        }
    }

    /**
     * Shape Selection Event
     */
    shapeCards.forEach(card => {
        card.addEventListener('click', function () {
            shapeCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            selectedShape = this.dataset.shape;
            nextToStep2Btn.classList.remove('opacity-50', 'cursor-not-allowed');
            nextToStep2Btn.disabled = false;
        });
    });

    /**
     * Check Parameters on Step Switch
     */
    nextToStep2Btn.addEventListener('click', function () {
        setTimeout(checkParametersComplete, 100);
    });

    /**
     * Next Step Button (Step 1 -> Step 2)
     */
    nextToStep2Btn.addEventListener('click', function () {
        step1.classList.add('hidden');
        step1.classList.remove('active');
        step2.classList.remove('hidden');
        step2.classList.add('active');

        updateStepIndicator(2);

        shapeParams.forEach(params => params.classList.add('hidden'));
        document.getElementById(`${selectedShape}-params`).classList.remove('hidden');

        currentStep = 2;
    });

    /**
     * Back Step Button (Step 2 -> Step 1)
     */
    backToStep1Btn.addEventListener('click', function () {
        step2.classList.add('hidden');
        step2.classList.remove('active');
        step1.classList.remove('hidden');
        step1.classList.add('active');

        updateStepIndicator(1);

        currentStep = 1;
    });

    /**
     * Calculate Result Button
     */
    calculateResultBtn.addEventListener('click', function () {
        if (!validateParameters()) {
            return;
        }

        calculateResults();
        updateResultDisplay();

        step2.classList.add('hidden');
        step2.classList.remove('active');
        step3.classList.remove('hidden');
        step3.classList.add('active');

        updateStepIndicator(3);
        enableReadonlyMode();

        currentStep = 3;
    });

    /**
     * Back Step Button (Step 3 -> Step 2)
     */
    backToStep2Btn.addEventListener('click', function () {
        step3.classList.add('hidden');
        step3.classList.remove('active');
        step2.classList.remove('hidden');
        step2.classList.add('active');

        updateStepIndicator(2);
        disableReadonlyMode();

        currentStep = 2;
    });

    /**
     * Recalculate Button
     */
    recalculateResultBtn.addEventListener('click', function () {
        step3.classList.add('hidden');
        step3.classList.remove('active');
        step2.classList.remove('hidden');
        step2.classList.add('active');

        updateStepIndicator(2);
        disableReadonlyMode();

        currentStep = 2;
    });

    /**
     * Restart Calculation Button
     */
    restartCalculationBtn.addEventListener('click', function () {
        resetCalculation();

        step3.classList.add('hidden');
        step3.classList.remove('active');
        step1.classList.remove('hidden');
        step1.classList.add('active');

        updateStepIndicator(1);
        disableReadonlyMode();
    });

    /**
     * Print Result Button
     */
    printResultBtn.addEventListener('click', function () {
        window.print();
    });

    /**
     * Export Result Button
     */
    exportResultBtn.addEventListener('click', function () {
        exportResults();
    });

    /**
     * Tab Switching
     */
    tabButtons.forEach(button => {
        button.addEventListener('click', function () {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            tabContents.forEach(content => content.classList.add('hidden'));
            document.getElementById(this.dataset.tab).classList.remove('hidden');

            if (this.dataset.tab === 'magnetic-properties' &&
                (calculationResults.shape === 'square' ||
                    calculationResults.shape === 'circle' ||
                    calculationResults.shape === 'ring')) {
                setTimeout(() => {
                    generateBlank3DView();
                }, 100);
            }
        });
    });

    /**
     * Output Count Change Listeners
     */
    document.getElementById('length-output-count').addEventListener('change', updateMachiningAllowanceDefaults);
    document.getElementById('width-output-count').addEventListener('change', updateMachiningAllowanceDefaults);
    document.getElementById('thickness-output-count').addEventListener('change', updateMachiningAllowanceDefaults);

    document.getElementById('circle-diameter-output-count').addEventListener('change', function () {
        updateMachiningAllowanceDefaultsForShape('circle');
    });
    document.getElementById('circle-thickness-output-count').addEventListener('change', function () {
        updateMachiningAllowanceDefaultsForShape('circle');
    });
    document.getElementById('circle-height-output-count').addEventListener('change', function () {
        updateMachiningAllowanceDefaultsForShape('circle');
    });

    document.getElementById('ring-outer-diameter-output-count').addEventListener('change', function () {
        updateMachiningAllowanceDefaultsForShape('ring');
    });
    document.getElementById('ring-inner-diameter-output-count').addEventListener('change', function () {
        updateMachiningAllowanceDefaultsForShape('ring');
    });
    document.getElementById('ring-thickness-output-count').addEventListener('change', function () {
        updateMachiningAllowanceDefaultsForShape('ring');
    });

    updateMachiningAllowanceDefaults();
    updateMachiningAllowanceDefaultsForShape('circle');
    updateMachiningAllowanceDefaultsForShape('ring');

    /**
     * Plating Thickness Presets
     */
    const platingTypeSelect = document.getElementById('plating-type');
    const platingThicknessInput = document.getElementById('plating-thickness');

    platingThicknessInput.value = platingThicknessPresets[platingTypeSelect.value];

    platingTypeSelect.addEventListener('change', function () {
        platingThicknessInput.value = platingThicknessPresets[this.value];
    });

    /**
     * Material Density Change
     */
    document.getElementById('material-density').addEventListener('change', function () {
        materialDensity = parseFloat(this.value) || 7.5;
        checkParametersComplete();
    });

    /**
     * Input Field Listeners
     */
    const inputFields = document.querySelectorAll('input[type="number"], select');
    inputFields.forEach(field => {
        field.addEventListener('input', checkParametersComplete);
        field.addEventListener('change', checkParametersComplete);
    });

    checkParametersComplete();

    // Initialize Three.js
    initThreeJS();
    initBlankThreeJS();
});

/**
 * Check Parameters Complete
 */
function checkParametersComplete() {
    let isComplete = true;

    const quantity = parseInt(document.getElementById('quantity').value);
    const magneticFluxDensity = parseFloat(document.getElementById('magnetic-flux-density').value);
    const coercivity = parseFloat(document.getElementById('coercivity').value);
    const materialDensityVal = parseFloat(document.getElementById('material-density').value);
    const platingThickness = parseFloat(document.getElementById('plating-thickness').value);
    const acidWashAmount = parseFloat(document.getElementById('acid-wash-amount').value);

    if (isNaN(quantity) || quantity < 1) isComplete = false;
    if (isNaN(magneticFluxDensity) || magneticFluxDensity <= 0) isComplete = false;
    if (isNaN(coercivity) || coercivity <= 0) isComplete = false;
    if (isNaN(materialDensityVal) || materialDensityVal <= 0) isComplete = false;
    if (isNaN(platingThickness) || platingThickness < 0) isComplete = false;
    if (isNaN(acidWashAmount) || acidWashAmount < 0) isComplete = false;

    switch (selectedShape) {
        case 'circle':
            const diameter = parseFloat(document.getElementById('circle-diameter').value);
            const thickness = parseFloat(document.getElementById('circle-thickness').value);
            const diameterOutputCount = parseInt(document.getElementById('circle-diameter-output-count').value);
            const circleThicknessOutputCount = parseInt(document.getElementById('circle-thickness-output-count').value);
            const heightOutputCount = parseInt(document.getElementById('circle-height-output-count').value);
            const diameterWireDiameter = parseFloat(document.getElementById('circle-diameter-wire-diameter').value);
            const circleThicknessWireDiameter = parseFloat(document.getElementById('circle-thickness-wire-diameter').value);
            const heightWireDiameter = parseFloat(document.getElementById('circle-height-wire-diameter').value);
            const diameterMachiningAllowance = parseFloat(document.getElementById('circle-diameter-machining-allowance').value);
            const circleThicknessMachiningAllowance = parseFloat(document.getElementById('circle-thickness-machining-allowance').value);
            const heightMachiningAllowance = parseFloat(document.getElementById('circle-height-machining-allowance').value);

            if (isNaN(diameter) || diameter <= 0) isComplete = false;
            if (isNaN(thickness) || thickness <= 0) isComplete = false;
            if (isNaN(diameterOutputCount) || diameterOutputCount < 1) isComplete = false;
            if (isNaN(circleThicknessOutputCount) || circleThicknessOutputCount < 1) isComplete = false;
            if (isNaN(heightOutputCount) || heightOutputCount < 1) isComplete = false;
            if (isNaN(diameterWireDiameter) || diameterWireDiameter < 0) isComplete = false;
            if (isNaN(circleThicknessWireDiameter) || circleThicknessWireDiameter < 0) isComplete = false;
            if (isNaN(heightWireDiameter) || heightWireDiameter < 0) isComplete = false;
            if (isNaN(diameterMachiningAllowance) || diameterMachiningAllowance < 0) isComplete = false;
            if (isNaN(circleThicknessMachiningAllowance) || circleThicknessMachiningAllowance < 0) isComplete = false;
            if (isNaN(heightMachiningAllowance) || heightMachiningAllowance < 0) isComplete = false;
            break;

        case 'square':
            const length = parseFloat(document.getElementById('square-length').value);
            const width = parseFloat(document.getElementById('square-width').value);
            const squareThickness = parseFloat(document.getElementById('square-thickness').value);
            const cornerRadius = parseFloat(document.getElementById('square-corner-radius').value);
            const lengthOutputCount = parseInt(document.getElementById('length-output-count').value);
            const widthOutputCount = parseInt(document.getElementById('width-output-count').value);
            const squareThicknessOutputCount = parseInt(document.getElementById('thickness-output-count').value);
            const lengthWireDiameter = parseFloat(document.getElementById('length-wire-diameter').value);
            const widthWireDiameter = parseFloat(document.getElementById('width-wire-diameter').value);
            const squareThicknessWireDiameter = parseFloat(document.getElementById('thickness-wire-diameter').value);
            const lengthMachiningAllowance = parseFloat(document.getElementById('length-machining-allowance').value);
            const widthMachiningAllowance = parseFloat(document.getElementById('width-machining-allowance').value);
            const squareThicknessMachiningAllowance = parseFloat(document.getElementById('thickness-machining-allowance').value);

            if (isNaN(length) || length <= 0) isComplete = false;
            if (isNaN(width) || width <= 0) isComplete = false;
            if (isNaN(squareThickness) || squareThickness <= 0) isComplete = false;
            if (isNaN(cornerRadius) || cornerRadius < 0) isComplete = false;
            if (isNaN(lengthOutputCount) || lengthOutputCount < 1) isComplete = false;
            if (isNaN(widthOutputCount) || widthOutputCount < 1) isComplete = false;
            if (isNaN(squareThicknessOutputCount) || squareThicknessOutputCount < 1) isComplete = false;
            if (isNaN(lengthWireDiameter) || lengthWireDiameter < 0) isComplete = false;
            if (isNaN(widthWireDiameter) || widthWireDiameter < 0) isComplete = false;
            if (isNaN(squareThicknessWireDiameter) || squareThicknessWireDiameter < 0) isComplete = false;
            if (isNaN(lengthMachiningAllowance) || lengthMachiningAllowance < 0) isComplete = false;
            if (isNaN(widthMachiningAllowance) || widthMachiningAllowance < 0) isComplete = false;
            if (isNaN(squareThicknessMachiningAllowance) || squareThicknessMachiningAllowance < 0) isComplete = false;
            break;

        case 'ring':
            const outerDiameter = parseFloat(document.getElementById('ring-outer-diameter').value);
            const innerDiameter = parseFloat(document.getElementById('ring-inner-diameter').value);
            const ringThickness = parseFloat(document.getElementById('ring-thickness').value);
            const outerDiameterOutputCount = parseInt(document.getElementById('ring-outer-diameter-output-count').value);
            const innerDiameterOutputCount = parseInt(document.getElementById('ring-inner-diameter-output-count').value);
            const ringThicknessOutputCount = parseInt(document.getElementById('ring-thickness-output-count').value);
            const outerDiameterWireDiameter = parseFloat(document.getElementById('ring-outer-diameter-wire-diameter').value);
            const innerDiameterWireDiameter = parseFloat(document.getElementById('ring-inner-diameter-wire-diameter').value);
            const ringThicknessWireDiameter = parseFloat(document.getElementById('ring-thickness-wire-diameter').value);
            const outerDiameterMachiningAllowance = parseFloat(document.getElementById('ring-outer-diameter-machining-allowance').value);
            const innerDiameterMachiningAllowance = parseFloat(document.getElementById('ring-inner-diameter-machining-allowance').value);
            const ringThicknessMachiningAllowance = parseFloat(document.getElementById('ring-thickness-machining-allowance').value);

            if (isNaN(outerDiameter) || outerDiameter <= 0) isComplete = false;
            if (isNaN(innerDiameter) || innerDiameter <= 0) isComplete = false;
            if (isNaN(ringThickness) || ringThickness <= 0) isComplete = false;
            if (innerDiameter >= outerDiameter) isComplete = false;
            if (isNaN(outerDiameterOutputCount) || outerDiameterOutputCount < 1) isComplete = false;
            if (isNaN(innerDiameterOutputCount) || innerDiameterOutputCount < 1) isComplete = false;
            if (isNaN(ringThicknessOutputCount) || ringThicknessOutputCount < 1) isComplete = false;
            if (isNaN(outerDiameterWireDiameter) || outerDiameterWireDiameter < 0) isComplete = false;
            if (isNaN(innerDiameterWireDiameter) || innerDiameterWireDiameter < 0) isComplete = false;
            if (isNaN(ringThicknessWireDiameter) || ringThicknessWireDiameter < 0) isComplete = false;
            if (isNaN(outerDiameterMachiningAllowance) || outerDiameterMachiningAllowance < 0) isComplete = false;
            if (isNaN(innerDiameterMachiningAllowance) || innerDiameterMachiningAllowance < 0) isComplete = false;
            if (isNaN(ringThicknessMachiningAllowance) || ringThicknessMachiningAllowance < 0) isComplete = false;
            break;
    }

    const calculateResultBtn = document.getElementById('calculate-result-btn');
    if (isComplete) {
        calculateResultBtn.classList.remove('bg-blue-300', 'cursor-not-allowed');
        calculateResultBtn.classList.add('bg-primary', 'hover:bg-blue-800');
        calculateResultBtn.disabled = false;
    } else {
        calculateResultBtn.classList.remove('bg-primary', 'hover:bg-blue-800');
        calculateResultBtn.classList.add('bg-blue-300', 'cursor-not-allowed');
        calculateResultBtn.disabled = true;
    }

    return isComplete;
}

/**
 * Update Step Indicator
 */
function updateStepIndicator(stepNumber) {
    if (stepNumber < 1 || stepNumber > 3) {
        console.error('Invalid step number:', stepNumber);
        return;
    }

    stepIndicators.forEach((indicator, index) => {
        const stepIndex = index + 1;
        const stepCircle = indicator.querySelector('.step-circle');
        const screenReaderText = indicator.querySelector('.sr-only');

        indicator.classList.remove('active');
        indicator.removeAttribute('aria-current');

        stepCircle.classList.remove('bg-primary', 'text-white');
        stepCircle.classList.add('bg-gray-200', 'text-gray-600');

        if (stepIndex === stepNumber) {
            indicator.classList.add('active');
            indicator.setAttribute('aria-current', 'step');
            stepCircle.classList.remove('bg-gray-200', 'text-gray-600');
            stepCircle.classList.add('bg-primary', 'text-white');

            screenReaderText.textContent = `步骤 ${stepNumber}: ${screenReaderText.textContent.split(':')[1].trim()}, 当前步骤`;
        } else {
            const stepText = screenReaderText.textContent.split(':')[1].split(',')[0].trim();
            screenReaderText.textContent = `步骤 ${stepIndex}: ${stepText}`;
        }
    });
}

/**
 * Validate Parameters
 */
function validateParameters() {
    let isValid = true;
    const quantity = parseInt(document.getElementById('quantity').value);
    const magneticFluxDensity = parseFloat(document.getElementById('magnetic-flux-density').value);
    const coercivity = parseFloat(document.getElementById('coercivity').value);

    if (isNaN(quantity) || quantity < 1) {
        alert('请输入有效的数量（至少1个）');
        isValid = false;
    }

    if (isNaN(magneticFluxDensity) || magneticFluxDensity <= 0) {
        alert('请输入有效的剩磁通量密度（大于0）');
        isValid = false;
    }

    if (isNaN(coercivity) || coercivity <= 0) {
        alert('请输入有效的矫顽力（大于0）');
        isValid = false;
    }

    const materialDensityVal = parseFloat(document.getElementById('material-density').value);
    if (isNaN(materialDensityVal) || materialDensityVal <= 0) {
        alert('请输入有效的材料密度（大于0）');
        isValid = false;
    }

    const platingThickness = parseFloat(document.getElementById('plating-thickness').value);
    if (isNaN(platingThickness) || platingThickness < 0) {
        alert('请输入有效的镀层厚度（大于等于0）');
        isValid = false;
    }

    const acidWashAmount = parseFloat(document.getElementById('acid-wash-amount').value);
    if (isNaN(acidWashAmount) || acidWashAmount < 0) {
        alert('请输入有效的酸洗量（大于等于0）');
        isValid = false;
    }

    switch (selectedShape) {
        case 'circle':
            const diameter = parseFloat(document.getElementById('circle-diameter').value);
            const thickness = parseFloat(document.getElementById('circle-thickness').value);
            const diameterOutputCount = parseInt(document.getElementById('circle-diameter-output-count').value);
            const circleThicknessOutputCount = parseInt(document.getElementById('circle-thickness-output-count').value);
            const heightOutputCount = parseInt(document.getElementById('circle-height-output-count').value);
            const diameterWireDiameter = parseFloat(document.getElementById('circle-diameter-wire-diameter').value);
            const circleThicknessWireDiameter = parseFloat(document.getElementById('circle-thickness-wire-diameter').value);
            const heightWireDiameter = parseFloat(document.getElementById('circle-height-wire-diameter').value);
            const diameterMachiningAllowance = parseFloat(document.getElementById('circle-diameter-machining-allowance').value);
            const circleThicknessMachiningAllowance = parseFloat(document.getElementById('circle-thickness-machining-allowance').value);
            const heightMachiningAllowance = parseFloat(document.getElementById('circle-height-machining-allowance').value);

            if (isNaN(diameter) || diameter <= 0) { alert('请输入有效的直径（大于0）'); isValid = false; }
            if (isNaN(thickness) || thickness <= 0) { alert('请输入有效的厚度（大于0）'); isValid = false; }
            if (isNaN(diameterOutputCount) || diameterOutputCount < 1) { alert('请输入有效的长度方向出数（至少1个）'); isValid = false; }
            if (isNaN(circleThicknessOutputCount) || circleThicknessOutputCount < 1) { alert('请输入有效的宽度方向出数（至少1个）'); isValid = false; }
            if (isNaN(heightOutputCount) || heightOutputCount < 1) { alert('请输入有效的高度方向出数（至少1个）'); isValid = false; }
            if (isNaN(diameterWireDiameter) || diameterWireDiameter < 0) { alert('请输入有效的多线线径@长度（大于等于0）'); isValid = false; }
            if (isNaN(circleThicknessWireDiameter) || circleThicknessWireDiameter < 0) { alert('请输入有效的多线线径@宽度（大于等于0）'); isValid = false; }
            if (isNaN(heightWireDiameter) || heightWireDiameter < 0) { alert('请输入有效的多线线径@高度（大于等于0）'); isValid = false; }
            if (isNaN(diameterMachiningAllowance) || diameterMachiningAllowance < 0) { alert('请输入有效的加工余量@长度（大于等于0）'); isValid = false; }
            if (isNaN(circleThicknessMachiningAllowance) || circleThicknessMachiningAllowance < 0) { alert('请输入有效的加工余量@宽度（大于等于0）'); isValid = false; }
            if (isNaN(heightMachiningAllowance) || heightMachiningAllowance < 0) { alert('请输入有效的加工余量@高度（大于等于0）'); isValid = false; }
            break;

        case 'square':
            const length = parseFloat(document.getElementById('square-length').value);
            const width = parseFloat(document.getElementById('square-width').value);
            const squareThickness = parseFloat(document.getElementById('square-thickness').value);
            const cornerRadius = parseFloat(document.getElementById('square-corner-radius').value);

            if (isNaN(length) || length <= 0) { alert('请输入有效的长度（大于0）'); isValid = false; }
            if (isNaN(width) || width <= 0) { alert('请输入有效的宽度（大于0）'); isValid = false; }
            if (isNaN(squareThickness) || squareThickness <= 0) { alert('请输入有效的厚度（大于0）'); isValid = false; }
            if (isNaN(cornerRadius) || cornerRadius < 0) { alert('请输入有效的R角（大于等于0）'); isValid = false; }

            const lengthOutputCount = parseInt(document.getElementById('length-output-count').value);
            const widthOutputCount = parseInt(document.getElementById('width-output-count').value);
            const squareThicknessOutputCount = parseInt(document.getElementById('thickness-output-count').value);

            if (isNaN(lengthOutputCount) || lengthOutputCount < 1) { alert('请输入有效的长度方向出数（至少1个）'); isValid = false; }
            if (isNaN(widthOutputCount) || widthOutputCount < 1) { alert('请输入有效的宽度方向出数（至少1个）'); isValid = false; }
            if (isNaN(squareThicknessOutputCount) || squareThicknessOutputCount < 1) { alert('请输入有效的厚度方向出数（至少1个）'); isValid = false; }

            const lengthWireDiameter = parseFloat(document.getElementById('length-wire-diameter').value);
            const widthWireDiameter = parseFloat(document.getElementById('width-wire-diameter').value);
            const squareThicknessWireDiameter = parseFloat(document.getElementById('thickness-wire-diameter').value);

            if (isNaN(lengthWireDiameter) || lengthWireDiameter < 0) { alert('请输入有效的多线线径@长度（大于等于0）'); isValid = false; }
            if (isNaN(widthWireDiameter) || widthWireDiameter < 0) { alert('请输入有效的多线线径@宽度（大于等于0）'); isValid = false; }
            if (isNaN(squareThicknessWireDiameter) || squareThicknessWireDiameter < 0) { alert('请输入有效的多线线径@厚度（大于等于0）'); isValid = false; }

            const lengthMachiningAllowance = parseFloat(document.getElementById('length-machining-allowance').value);
            const widthMachiningAllowance = parseFloat(document.getElementById('width-machining-allowance').value);
            const squareThicknessMachiningAllowance = parseFloat(document.getElementById('thickness-machining-allowance').value);

            if (isNaN(lengthMachiningAllowance) || lengthMachiningAllowance < 0) { alert('请输入有效的加工余量@长度（大于等于0）'); isValid = false; }
            if (isNaN(widthMachiningAllowance) || widthMachiningAllowance < 0) { alert('请输入有效的加工余量@宽度（大于等于0）'); isValid = false; }
            if (isNaN(squareThicknessMachiningAllowance) || squareThicknessMachiningAllowance < 0) { alert('请输入有效的加工余量@厚度（大于等于0）'); isValid = false; }
            break;

        case 'ring':
            const outerDiameter = parseFloat(document.getElementById('ring-outer-diameter').value);
            const innerDiameter = parseFloat(document.getElementById('ring-inner-diameter').value);
            const ringThickness = parseFloat(document.getElementById('ring-thickness').value);
            const outerDiameterOutputCount = parseInt(document.getElementById('ring-outer-diameter-output-count').value);
            const innerDiameterOutputCount = parseInt(document.getElementById('ring-inner-diameter-output-count').value);
            const ringThicknessOutputCount = parseInt(document.getElementById('ring-thickness-output-count').value);
            const outerDiameterWireDiameter = parseFloat(document.getElementById('ring-outer-diameter-wire-diameter').value);
            const innerDiameterWireDiameter = parseFloat(document.getElementById('ring-inner-diameter-wire-diameter').value);
            const ringThicknessWireDiameter = parseFloat(document.getElementById('ring-thickness-wire-diameter').value);
            const outerDiameterMachiningAllowance = parseFloat(document.getElementById('ring-outer-diameter-machining-allowance').value);
            const innerDiameterMachiningAllowance = parseFloat(document.getElementById('ring-inner-diameter-machining-allowance').value);
            const ringThicknessMachiningAllowance = parseFloat(document.getElementById('ring-thickness-machining-allowance').value);

            if (isNaN(outerDiameter) || outerDiameter <= 0) { alert('请输入有效的外直径（大于0）'); isValid = false; }
            if (isNaN(innerDiameter) || innerDiameter <= 0) { alert('请输入有效的内直径（大于0）'); isValid = false; }
            if (isNaN(ringThickness) || ringThickness <= 0) { alert('请输入有效的厚度（大于0）'); isValid = false; }
            if (innerDiameter >= outerDiameter) { alert('内直径必须小于外直径'); isValid = false; }
            if (isNaN(outerDiameterOutputCount) || outerDiameterOutputCount < 1) { alert('请输入有效的长度方向出数（至少1个）'); isValid = false; }
            if (isNaN(innerDiameterOutputCount) || innerDiameterOutputCount < 1) { alert('请输入有效的宽度方向出数（至少1个）'); isValid = false; }
            if (isNaN(ringThicknessOutputCount) || ringThicknessOutputCount < 1) { alert('请输入有效的厚度方向出数（至少1个）'); isValid = false; }
            if (isNaN(outerDiameterWireDiameter) || outerDiameterWireDiameter < 0) { alert('请输入有效的多线线径@长度（大于等于0）'); isValid = false; }
            if (isNaN(innerDiameterWireDiameter) || innerDiameterWireDiameter < 0) { alert('请输入有效的多线线径@宽度（大于等于0）'); isValid = false; }
            if (isNaN(ringThicknessWireDiameter) || ringThicknessWireDiameter < 0) { alert('请输入有效的多线线径@厚度（大于等于0）'); isValid = false; }
            if (isNaN(outerDiameterMachiningAllowance) || outerDiameterMachiningAllowance < 0) { alert('请输入有效的加工余量@长度（大于等于0）'); isValid = false; }
            if (isNaN(innerDiameterMachiningAllowance) || innerDiameterMachiningAllowance < 0) { alert('请输入有效的加工余量@宽度（大于等于0）'); isValid = false; }
            if (isNaN(ringThicknessMachiningAllowance) || ringThicknessMachiningAllowance < 0) { alert('请输入有效的加工余量@厚度（大于等于0）'); isValid = false; }
            break;
    }

    return isValid;
}

/**
 * Calculate Results
 */
function calculateResults() {
    const quantity = parseInt(document.getElementById('quantity').value);
    const magneticFluxDensity = parseFloat(document.getElementById('magnetic-flux-density').value);
    const coercivity = parseFloat(document.getElementById('coercivity').value);
    const materialDensity = parseFloat(document.getElementById('material-density').value);

    let volume = 0;
    let surfaceArea = 0;
    let crossSectionalArea = 0;

    switch (selectedShape) {
        case 'circle':
            const diameter = parseFloat(document.getElementById('circle-diameter').value);
            const thickness = parseFloat(document.getElementById('circle-thickness').value);
            const radius = diameter / 2;

            volume = Math.PI * Math.pow(radius, 2) * thickness;
            surfaceArea = 2 * Math.PI * Math.pow(radius, 2) + 2 * Math.PI * radius * thickness;
            crossSectionalArea = Math.PI * Math.pow(radius, 2);
            break;

        case 'square':
            const length = parseFloat(document.getElementById('square-length').value);
            const width = parseFloat(document.getElementById('square-width').value);
            const squareThickness = parseFloat(document.getElementById('square-thickness').value);
            const cornerRadius = parseFloat(document.getElementById('square-corner-radius').value);

            const baseVolume = length * width * squareThickness;
            const subtractedVolume = Math.PI * Math.pow(cornerRadius, 2) * (length + width + squareThickness);
            const addedVolume = (4 / 3) * Math.PI * Math.pow(cornerRadius, 3);
            volume = baseVolume - subtractedVolume + addedVolume;

            surfaceArea = 2 * (length * width + length * squareThickness + width * squareThickness);
            crossSectionalArea = length * width;
            break;

        case 'ring':
            const outerDiameter = parseFloat(document.getElementById('ring-outer-diameter').value);
            const innerDiameter = parseFloat(document.getElementById('ring-inner-diameter').value);
            const ringThickness = parseFloat(document.getElementById('ring-thickness').value);
            const outerRadius = outerDiameter / 2;
            const innerRadius = innerDiameter / 2;

            volume = Math.PI * (Math.pow(outerRadius, 2) - Math.pow(innerRadius, 2)) * ringThickness;
            surfaceArea = 2 * Math.PI * (Math.pow(outerRadius, 2) - Math.pow(innerRadius, 2)) +
                2 * Math.PI * (outerRadius + innerRadius) * ringThickness;
            break;
    }

    const singleWeight = volume * materialDensity / 1000;
    const totalWeight = singleWeight * quantity;

    const volume_cm3 = volume / 1000;
    const magneticMoment = magneticFluxDensity * volume_cm3 * 100 * 0.97;

    let pcValue = 0;
    switch (selectedShape) {
        case 'circle':
            const diameter = parseFloat(document.getElementById('circle-diameter').value);
            const thickness = parseFloat(document.getElementById('circle-thickness').value);
            pcValue = 4 * thickness / diameter / diameter * Math.sqrt((diameter / 2) * (diameter / 2 + thickness));
            break;

        case 'square':
            const H = parseFloat(document.getElementById('square-thickness').value);
            const L = parseFloat(document.getElementById('square-length').value);
            const W = parseFloat(document.getElementById('square-width').value);
            pcValue = 1.77 * H / (L * W) * Math.sqrt(H * (L + W) + L * W);
            break;

        case 'ring':
            const outerDiameter = parseFloat(document.getElementById('ring-outer-diameter').value);
            const innerDiameter = parseFloat(document.getElementById('ring-inner-diameter').value);
            const ringThickness = parseFloat(document.getElementById('ring-thickness').value);

            // Pc = SQRT(thickness * (ID + OD) * 0.5 + 0.25 * (OD * OD + ID * ID)) * 4 * thickness / (OD * OD - ID * ID)
            const term1 = ringThickness * (innerDiameter + outerDiameter) * 0.5;
            const term2 = 0.25 * (Math.pow(outerDiameter, 2) + Math.pow(innerDiameter, 2));
            const numerator = Math.sqrt(term1 + term2) * 4 * ringThickness;
            const denominator = Math.pow(outerDiameter, 2) - Math.pow(innerDiameter, 2);

            pcValue = numerator / denominator;
            break;
    }

    const magnetOrientation = document.getElementById('magnet-orientation').value;
    const platingThickness = parseFloat(document.getElementById('plating-thickness').value);
    const acidWashAmount = parseFloat(document.getElementById('acid-wash-amount').value);

    let blankLength = 0;
    let blankWidth = 0;
    let blankThickness = 0;
    let blankVolume = 0;
    let blankWeight = 0;
    let blankOutputCount = 0;
    let materialUtilization = 0;

    if (selectedShape === 'square') {
        const lengthOutputCount = parseInt(document.getElementById('length-output-count').value);
        const widthOutputCount = parseInt(document.getElementById('width-output-count').value);
        const thicknessOutputCount = parseInt(document.getElementById('thickness-output-count').value);

        const lengthWireDiameter = parseFloat(document.getElementById('length-wire-diameter').value);
        const widthWireDiameter = parseFloat(document.getElementById('width-wire-diameter').value);
        const thicknessWireDiameter = parseFloat(document.getElementById('thickness-wire-diameter').value);

        const lengthMachiningAllowance = parseFloat(document.getElementById('length-machining-allowance').value);
        const widthMachiningAllowance = parseFloat(document.getElementById('width-machining-allowance').value);
        const thicknessMachiningAllowance = parseFloat(document.getElementById('thickness-machining-allowance').value);

        const length = parseFloat(document.getElementById('square-length').value);
        const width = parseFloat(document.getElementById('square-width').value);
        const squareThickness = parseFloat(document.getElementById('square-thickness').value);

        const platingThicknessInMm = platingThickness / 1000;
        const acidWashAmountInMm = acidWashAmount / 1000;

        const effectiveLengthPerPiece = length + lengthWireDiameter + 0.1 - 2 * platingThicknessInMm + acidWashAmountInMm;
        const effectiveWidthPerPiece = width + widthWireDiameter + 0.1 - 2 * platingThicknessInMm + acidWashAmountInMm;
        const effectiveThicknessPerPiece = squareThickness + thicknessWireDiameter + 0.1 - 2 * platingThicknessInMm + acidWashAmountInMm;

        blankLength = lengthOutputCount * effectiveLengthPerPiece + lengthMachiningAllowance;
        blankWidth = widthOutputCount * effectiveWidthPerPiece + widthMachiningAllowance;
        blankThickness = thicknessOutputCount * effectiveThicknessPerPiece + thicknessMachiningAllowance;

        blankVolume = blankLength * blankWidth * blankThickness / 1000;
        blankWeight = blankVolume * materialDensity;
        blankOutputCount = lengthOutputCount * widthOutputCount * thicknessOutputCount;

        const productVolumePerPiece = length * width * squareThickness;
        materialUtilization = (productVolumePerPiece * blankOutputCount / blankVolume) * 100 / 1000;
    } else if (selectedShape === 'circle') {
        const diameterOutputCount = parseInt(document.getElementById('circle-diameter-output-count').value);
        const circleThicknessOutputCount = parseInt(document.getElementById('circle-thickness-output-count').value);
        const heightOutputCount = parseInt(document.getElementById('circle-height-output-count').value);

        const diameterWireDiameter = parseFloat(document.getElementById('circle-diameter-wire-diameter').value);
        const circleThicknessWireDiameter = parseFloat(document.getElementById('circle-thickness-wire-diameter').value);
        const heightWireDiameter = parseFloat(document.getElementById('circle-height-wire-diameter').value);

        const diameterMachiningAllowance = parseFloat(document.getElementById('circle-diameter-machining-allowance').value);
        const circleThicknessMachiningAllowance = parseFloat(document.getElementById('circle-thickness-machining-allowance').value);
        const heightMachiningAllowance = parseFloat(document.getElementById('circle-height-machining-allowance').value);

        const diameter = parseFloat(document.getElementById('circle-diameter').value);
        const thickness = parseFloat(document.getElementById('circle-thickness').value);

        const platingThicknessInMm = platingThickness / 1000;
        const acidWashAmountInMm = acidWashAmount / 1000;

        const effectiveDiameterPerPiece = diameter + diameterWireDiameter + 0.1 - 2 * platingThicknessInMm + acidWashAmountInMm;
        const effectiveThicknessPerPiece = thickness + circleThicknessWireDiameter + 0.1 - 2 * platingThicknessInMm + acidWashAmountInMm;
        const effectiveHeightPerPiece = thickness + heightWireDiameter + 0.1 - 2 * platingThicknessInMm + acidWashAmountInMm;

        blankLength = diameterOutputCount * effectiveDiameterPerPiece + diameterMachiningAllowance;
        blankWidth = circleThicknessOutputCount * effectiveDiameterPerPiece + circleThicknessMachiningAllowance;
        blankThickness = heightOutputCount * effectiveHeightPerPiece + heightMachiningAllowance;

        blankVolume = blankLength * blankWidth * blankThickness / 1000;
        blankWeight = blankVolume * materialDensity;
        blankOutputCount = diameterOutputCount * circleThicknessOutputCount * heightOutputCount;

        const productVolumePerPiece = Math.PI * Math.pow(diameter / 2, 2) * thickness;
        materialUtilization = (productVolumePerPiece * blankOutputCount / (blankVolume * 1000)) * 100;
    } else if (selectedShape === 'ring') {
        const outerDiameterOutputCount = parseInt(document.getElementById('ring-outer-diameter-output-count').value);
        const innerDiameterOutputCount = parseInt(document.getElementById('ring-inner-diameter-output-count').value);
        const ringThicknessOutputCount = parseInt(document.getElementById('ring-thickness-output-count').value);

        const outerDiameterWireDiameter = parseFloat(document.getElementById('ring-outer-diameter-wire-diameter').value);
        const innerDiameterWireDiameter = parseFloat(document.getElementById('ring-inner-diameter-wire-diameter').value);
        const ringThicknessWireDiameter = parseFloat(document.getElementById('ring-thickness-wire-diameter').value);

        const outerDiameterMachiningAllowance = parseFloat(document.getElementById('ring-outer-diameter-machining-allowance').value);
        const innerDiameterMachiningAllowance = parseFloat(document.getElementById('ring-inner-diameter-machining-allowance').value);
        const ringThicknessMachiningAllowance = parseFloat(document.getElementById('ring-thickness-machining-allowance').value);

        const outerDiameter = parseFloat(document.getElementById('ring-outer-diameter').value);
        const innerDiameter = parseFloat(document.getElementById('ring-inner-diameter').value);
        const ringThickness = parseFloat(document.getElementById('ring-thickness').value);

        const platingThicknessInMm = platingThickness / 1000;
        const acidWashAmountInMm = acidWashAmount / 1000;

        const effectiveOuterDiameterPerPiece = outerDiameter + outerDiameterWireDiameter + 0.1 - 2 * platingThicknessInMm + acidWashAmountInMm;
        const effectiveInnerDiameterPerPiece = innerDiameter + innerDiameterWireDiameter + 0.1 - 2 * platingThicknessInMm + acidWashAmountInMm;
        const effectiveThicknessPerPiece = ringThickness + ringThicknessWireDiameter + 0.1 - 2 * platingThicknessInMm + acidWashAmountInMm;

        blankLength = outerDiameterOutputCount * effectiveOuterDiameterPerPiece + outerDiameterMachiningAllowance;
        blankWidth = innerDiameterOutputCount * effectiveOuterDiameterPerPiece + innerDiameterMachiningAllowance;
        blankThickness = ringThicknessOutputCount * effectiveThicknessPerPiece + ringThicknessMachiningAllowance;

        blankVolume = blankLength * blankWidth * blankThickness / 1000;
        blankWeight = blankVolume * materialDensity;
        blankOutputCount = outerDiameterOutputCount * innerDiameterOutputCount * ringThicknessOutputCount;

        const productVolumePerPiece = Math.PI * (Math.pow(outerDiameter / 2, 2) - Math.pow(innerDiameter / 2, 2)) * ringThickness;
        materialUtilization = (productVolumePerPiece * blankOutputCount / (blankVolume * 1000)) * 100;
    }

    calculationResults = {
        shape: selectedShape,
        magnetOrientation: magnetOrientation,
        density: materialDensity,
        volume: volume,
        surfaceArea: surfaceArea,
        crossSectionalArea: crossSectionalArea,
        quantity: quantity,
        magneticFluxDensity: magneticFluxDensity,
        coercivity: coercivity,
        singleWeight: singleWeight,
        totalWeight: totalWeight,
        magneticMoment: magneticMoment,
        pcValue: pcValue,
        blankLength: blankLength,
        blankWidth: blankWidth,
        blankThickness: blankThickness,
        blankVolume: blankVolume,
        blankWeight: blankWeight,
        blankOutputCount: blankOutputCount,
        materialUtilization: materialUtilization,
        platingThickness: platingThickness,
        acidWashAmount: acidWashAmount
    };
}

/**
 * Update Result Display
 */
function updateResultDisplay() {
    document.getElementById('result-volume').textContent = calculationResults.volume.toFixed(2) + ' mm³';
    document.getElementById('result-surface-area').textContent = calculationResults.surfaceArea.toFixed(2) + ' mm²';
    document.getElementById('result-density').textContent = calculationResults.density.toFixed(2) + ' g/cm³';
    document.getElementById('result-magnetic-flux-density').textContent = calculationResults.magneticFluxDensity.toFixed(2) + ' T';
    document.getElementById('result-coercivity').textContent = calculationResults.coercivity.toFixed(2) + ' kA/m';

    document.getElementById('result-single-weight').textContent = calculationResults.singleWeight.toFixed(2) + ' g';
    document.getElementById('result-total-weight').textContent = calculationResults.totalWeight.toFixed(2) + ' g';
    document.getElementById('result-magnetic-moment').textContent = calculationResults.magneticMoment.toFixed(2) + ' μWb·cm';

    document.getElementById('result-pc-value').textContent = calculationResults.pcValue.toFixed(2);

    document.getElementById('result-magnet-orientation').textContent =
        orientationText[calculationResults.magnetOrientation] || calculationResults.magnetOrientation;

    if (calculationResults.shape === 'square' || calculationResults.shape === 'circle' || calculationResults.shape === 'ring') {
        document.getElementById('result-blank-length').textContent = calculationResults.blankLength.toFixed(2) + ' mm';
        document.getElementById('result-blank-width').textContent = calculationResults.blankWidth.toFixed(2) + ' mm';
        document.getElementById('result-blank-thickness').textContent = calculationResults.blankThickness.toFixed(2) + ' mm';
        document.getElementById('result-blank-volume').textContent = calculationResults.blankVolume.toFixed(2) + ' cm³';
        document.getElementById('result-blank-weight').textContent = calculationResults.blankWeight.toFixed(2) + ' g';
        document.getElementById('result-blank-output-count').textContent = calculationResults.blankOutputCount + ' 个';
        document.getElementById('result-material-utilization').textContent = calculationResults.materialUtilization.toFixed(2) + '%';
    } else {
        document.getElementById('result-blank-length').textContent = '-';
        document.getElementById('result-blank-width').textContent = '-';
        document.getElementById('result-blank-thickness').textContent = '-';
        document.getElementById('result-blank-volume').textContent = '-';
        document.getElementById('result-blank-weight').textContent = '-';
        document.getElementById('result-blank-output-count').textContent = '-';
        document.getElementById('result-material-utilization').textContent = '-';
    }

    // Generate 3D view for the product
    setTimeout(() => {
        generate3DView();
    }, 100);
}

/**
 * Reset Calculation
 */
function resetCalculation() {
    shapeCards.forEach(card => card.classList.remove('active'));
    selectedShape = null;

    nextToStep2Btn.classList.add('opacity-50', 'cursor-not-allowed');
    nextToStep2Btn.disabled = true;

    document.getElementById('quantity').value = 1;
    document.getElementById('magnetic-flux-density').value = '';
    document.getElementById('coercivity').value = '';
    document.getElementById('material-density').value = '7.55';
    document.getElementById('magnet-orientation').value = 'axial';

    document.getElementById('circle-diameter').value = '';
    document.getElementById('circle-thickness').value = '';
    document.getElementById('square-length').value = '';
    document.getElementById('square-width').value = '';
    document.getElementById('square-thickness').value = '';
    document.getElementById('square-corner-radius').value = '';
    document.getElementById('ring-outer-diameter').value = '';
    document.getElementById('ring-inner-diameter').value = '';
    document.getElementById('ring-thickness').value = '';

    document.getElementById('length-output-count').value = '1';
    document.getElementById('width-output-count').value = '1';
    document.getElementById('thickness-output-count').value = '1';
    document.getElementById('length-wire-diameter').value = '0.175';
    document.getElementById('width-wire-diameter').value = '0.175';
    document.getElementById('thickness-wire-diameter').value = '0.175';

    document.getElementById('circle-diameter-output-count').value = '1';
    document.getElementById('circle-thickness-output-count').value = '1';
    document.getElementById('circle-height-output-count').value = '1';
    document.getElementById('circle-diameter-wire-diameter').value = '0.175';
    document.getElementById('circle-thickness-wire-diameter').value = '0.175';
    document.getElementById('circle-height-wire-diameter').value = '0.175';
    document.getElementById('circle-diameter-machining-allowance').value = '';
    document.getElementById('circle-thickness-machining-allowance').value = '';
    document.getElementById('circle-height-machining-allowance').value = '';

    document.getElementById('ring-outer-diameter-output-count').value = '1';
    document.getElementById('ring-inner-diameter-output-count').value = '1';
    document.getElementById('ring-thickness-output-count').value = '1';
    document.getElementById('ring-outer-diameter-wire-diameter').value = '0.175';
    document.getElementById('ring-inner-diameter-wire-diameter').value = '0.175';
    document.getElementById('ring-thickness-wire-diameter').value = '0.175';
    document.getElementById('ring-outer-diameter-machining-allowance').value = '';
    document.getElementById('ring-inner-diameter-machining-allowance').value = '';
    document.getElementById('ring-thickness-machining-allowance').value = '';

    // We need to call updateMachiningAllowanceDefaults, but it's inside DOMContentLoaded. 
    // However, we can just manually trigger the change event or copy the logic.
    // Since we are inside script.js, we can't easily access the inner function unless we expose it or move it out.
    // The best way is to move updateMachiningAllowanceDefaults to global scope or just trigger the event.
    // Triggering events is safer.
    document.getElementById('length-output-count').dispatchEvent(new Event('change'));
    document.getElementById('circle-diameter-output-count').dispatchEvent(new Event('change'));
    document.getElementById('ring-outer-diameter-output-count').dispatchEvent(new Event('change'));

    calculationResults = {};
}

/**
 * Enable Readonly Mode
 */
function enableReadonlyMode() {
    const inputFields = step2.querySelectorAll('input, select');
    inputFields.forEach(field => {
        field.classList.add('readonly-mode');
        field.setAttribute('readonly', 'readonly');
        if (field.tagName === 'SELECT') {
            field.disabled = true;
        }
    });
}

/**
 * Disable Readonly Mode
 */
function disableReadonlyMode() {
    const inputFields = step2.querySelectorAll('input, select');
    inputFields.forEach(field => {
        field.classList.remove('readonly-mode');
        field.removeAttribute('readonly');
        if (field.tagName === 'SELECT') {
            field.disabled = false;
        }
    });
}

/**
 * Export Results
 */
function exportResults() {
    const csvContent = [
        '参数,值',
        '形状,' + (calculationResults.shape === 'circle' ? '圆形' : calculationResults.shape === 'square' ? '方形' : '环形'),
        '材料密度,' + calculationResults.density.toFixed(2) + ' g/cm³',
        '磁钢取向,' + (calculationResults.magnetOrientation === 'axial' ? '轴向 (Axial)' : '径向 (Radial)'),
        '体积,' + calculationResults.volume.toFixed(4) + ' cm³',
        '表面积,' + calculationResults.surfaceArea.toFixed(4) + ' cm²',
        '数量,' + calculationResults.quantity + ' 个',
        '剩磁通量密度,' + calculationResults.magneticFluxDensity.toFixed(4) + ' T',
        '矫顽力,' + calculationResults.coercivity.toFixed(2) + ' kA/m',
        '单个重量,' + calculationResults.singleWeight.toFixed(4) + ' g',
        '总重量,' + calculationResults.totalWeight.toFixed(4) + ' g',
        '磁矩 (MM),' + calculationResults.magneticMoment.toFixed(4) + ' μWb·cm',
        'Pc值 (磁导系数),' + calculationResults.pcValue.toFixed(4)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', '磁钢计算结果.csv');
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
/**
 * Initialize Three.js
 */
function initThreeJS() {
    try {
        const canvas = document.getElementById('product-3d-canvas');
        const container = document.getElementById('product-3d-view');

        if (!canvas || !container) {
            console.error('Required elements not found:', { canvas: !!canvas, container: !!container });
            return false;
        }

        const width = Math.max(container.clientWidth || 400, 300);
        const height = Math.max(container.clientHeight || 300, 200);

        // Create Scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf8fafc);
        scene.fog = null;

        // Create Camera
        camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 2000);
        camera.position.set(5, 5, 5);
        camera.lookAt(0, 0, 0);

        // Create Renderer
        const rendererOptions = {
            canvas: canvas,
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            stencil: false,
            depth: true,
            logarithmicDepthBuffer: true,
            precision: 'highp'
        };

        renderer = new THREE.WebGLRenderer(rendererOptions);
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        renderer.shadowMap.enabled = false;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.0;

        // Create Controls
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enableZoom = true;
        controls.enableRotate = true;
        controls.enablePan = false;
        controls.maxPolarAngle = Math.PI;
        controls.minDistance = 2;
        controls.maxDistance = 50;
        controls.autoRotate = false;

        // Add Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(5, 10, 5);
        directionalLight.castShadow = false;
        scene.add(directionalLight);

        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.2);
        directionalLight2.position.set(-5, 5, 5);
        scene.add(directionalLight2);

        // Optimize for low DPI
        if (window.devicePixelRatio < 2) {
            console.log('Low DPI device detected, optimizing for performance');
            renderer.setPixelRatio(1);
        }

        // Resize Handler
        let resizeTimeout;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(handleResize, 200);
        });

        // Start Animation Loop
        animate();

        threeJSInitialized = true;
        console.log('Three.js initialized successfully');
        return true;

    } catch (error) {
        console.error('Three.js initialization failed:', error);
        const errorElement = document.getElementById('product-3d-shape-info');
        if (errorElement) {
            errorElement.textContent = '3D视图初始化失败，请刷新页面重试';
            errorElement.style.color = '#ef4444';
        }
        return false;
    }
}

/**
 * Animation Loop
 */
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

/**
 * Handle Resize
 */
function handleResize() {
    const container = document.getElementById('product-3d-view');
    const width = container.clientWidth;
    const height = container.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

/**
 * Generate 3D View
 */
function generate3DView() {
    if (!calculationResults || !calculationResults.shape) {
        console.error('No valid calculation results available');
        return;
    }

    if (!threeJSInitialized) {
        console.log('Three.js not initialized, initializing now...');
        initThreeJS();
        setTimeout(() => {
            if (threeJSInitialized) {
                generate3DView();
            }
        }, 500);
        return;
    }

    const loadingElement = document.getElementById('threejs-loading');
    const shapeInfo = document.getElementById('product-3d-shape-info');

    try {
        loadingElement.classList.remove('hidden');

        // Clear previous magnet
        if (currentMagnet) {
            scene.remove(currentMagnet);
            currentMagnet = null;
        }

        // Clear orientation indicators
        scene.children.forEach(child => {
            if (child.userData.isOrientationIndicator) {
                scene.remove(child);
            }
        });

        setTimeout(() => {
            try {
                console.log('Generating 3D view for shape:', calculationResults.shape);

                switch (calculationResults.shape) {
                    case 'circle':
                        createCircularMagnet3D();
                        shapeInfo.textContent = `圆形磁钢 - 直径: ${document.getElementById('circle-diameter').value}mm, 厚度: ${document.getElementById('circle-thickness').value}mm`;
                        break;
                    case 'square':
                        createSquareMagnet3D();
                        shapeInfo.textContent = `方形磁钢 - 长: ${document.getElementById('square-length').value}mm, 宽: ${document.getElementById('square-width').value}mm, 厚: ${document.getElementById('square-thickness').value}mm`;
                        break;
                    case 'ring':
                        createRingMagnet3D();
                        shapeInfo.textContent = `环形磁钢 - 外径: ${document.getElementById('ring-outer-diameter').value}mm, 内径: ${document.getElementById('ring-inner-diameter').value}mm, 厚度: ${document.getElementById('ring-thickness').value}mm`;
                        break;
                }

                // Add orientation indicator
                const orientation = document.getElementById('magnet-orientation').value;
                addOrientationIndicator(orientation);

            } catch (error) {
                console.error('Error generating 3D view:', error);
                shapeInfo.textContent = '3D视图生成失败: ' + error.message;
            } finally {
                loadingElement.classList.add('hidden');
            }
        }, 100);

    } catch (error) {
        console.error('Error in generate3DView:', error);
        loadingElement.classList.add('hidden');
        shapeInfo.textContent = '3D视图初始化失败';
    }
}
/**
 * Initialize Blank Three.js
 */
function initBlankThreeJS() {
    try {
        const canvas = document.getElementById('blank-3d-canvas');
        const container = document.getElementById('blank-3d-view');

        if (!canvas || !container) {
            console.error('Required blank elements not found:', { canvas: !!canvas, container: !!container });
            return false;
        }

        const width = Math.max(container.clientWidth || 400, 300);
        const height = Math.max(container.clientHeight || 300, 200);

        // Create Scene
        blankScene = new THREE.Scene();
        blankScene.background = new THREE.Color(0xf8fafc);
        blankScene.fog = null;

        // Create Camera
        blankCamera = new THREE.PerspectiveCamera(75, width / height, 0.1, 2000);
        blankCamera.position.set(5, 5, 5);
        blankCamera.lookAt(0, 0, 0);

        // Create Renderer
        const rendererOptions = {
            canvas: canvas,
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            stencil: false,
            depth: true,
            logarithmicDepthBuffer: true,
            precision: 'highp'
        };

        blankRenderer = new THREE.WebGLRenderer(rendererOptions);
        blankRenderer.setSize(width, height);
        blankRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        blankRenderer.shadowMap.enabled = false;
        blankRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
        blankRenderer.outputEncoding = THREE.sRGBEncoding;
        blankRenderer.toneMapping = THREE.ACESFilmicToneMapping;
        blankRenderer.toneMappingExposure = 1.0;

        // Create Controls
        blankControls = new THREE.OrbitControls(blankCamera, blankRenderer.domElement);
        blankControls.enableDamping = true;
        blankControls.dampingFactor = 0.05;
        blankControls.enableZoom = true;
        blankControls.enableRotate = true;
        blankControls.enablePan = false;
        blankControls.maxPolarAngle = Math.PI;
        blankControls.minDistance = 2;
        blankControls.maxDistance = 50;
        blankControls.autoRotate = false;

        // Add Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
        blankScene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(5, 10, 5);
        directionalLight.castShadow = false;
        blankScene.add(directionalLight);

        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.2);
        directionalLight2.position.set(-5, 5, 5);
        blankScene.add(directionalLight2);

        // Optimize for low DPI
        if (window.devicePixelRatio < 2) {
            console.log('Low DPI device detected, optimizing for performance');
            blankRenderer.setPixelRatio(1);
        }

        // Resize Handler
        let resizeTimeout;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(handleBlankResize, 200);
        });

        // Start Animation Loop
        animateBlank();

        blankThreeJSInitialized = true;
        console.log('Blank Three.js initialized successfully');
        return true;

    } catch (error) {
        console.error('Blank Three.js initialization failed:', error);
        const errorElement = document.getElementById('blank-3d-shape-info');
        if (errorElement) {
            errorElement.textContent = '毛坯3D视图初始化失败，请刷新页面重试';
            errorElement.style.color = '#ef4444';
        }
        return false;
    }
}

/**
 * Animation Loop for Blank
 */
function animateBlank() {
    requestAnimationFrame(animateBlank);
    blankControls.update();
    blankRenderer.render(blankScene, blankCamera);
}

/**
 * Handle Blank Resize
 */
function handleBlankResize() {
    const container = document.getElementById('blank-3d-view');
    const width = container.clientWidth;
    const height = container.clientHeight;

    blankCamera.aspect = width / height;
    blankCamera.updateProjectionMatrix();
    blankRenderer.setSize(width, height);
}

/**
 * Generate Blank 3D View
 */
function generateBlank3DView() {
    if (!calculationResults || !calculationResults.shape ||
        (calculationResults.shape !== 'square' && calculationResults.shape !== 'circle' && calculationResults.shape !== 'ring')) {
        console.error('No valid calculation results available for blank view');
        return;
    }

    if (!blankThreeJSInitialized) {
        console.log('Blank Three.js not initialized, initializing now...');
        initBlankThreeJS();
        setTimeout(() => {
            if (blankThreeJSInitialized) {
                createBlank3D();
            }
        }, 500);
        return;
    }

    const loadingElement = document.getElementById('blank-threejs-loading');
    const shapeInfo = document.getElementById('blank-3d-shape-info');

    try {
        loadingElement.classList.remove('hidden');

        if (currentBlank) {
            if (currentBlank.userData.magnetizationArrows) {
                currentBlank.userData.magnetizationArrows.forEach(arrow => {
                    blankScene.remove(arrow);
                });
            }
            blankScene.remove(currentBlank);
            currentBlank = null;
        }

        setTimeout(() => {
            try {
                console.log('Generating blank 3D view with high precision');

                const blankLength = calculationResults.blankLength;
                const blankWidth = calculationResults.blankWidth;
                const blankThickness = calculationResults.blankThickness;

                shapeInfo.textContent = `毛坯 - 长度: ${blankLength.toFixed(2)}mm, 宽度: ${blankWidth.toFixed(2)}mm, 厚度: ${blankThickness.toFixed(2)}mm`;
                createBlank3D();
            } catch (error) {
                console.error('Error generating blank 3D view:', error);
                shapeInfo.textContent = '毛坯3D视图生成失败: ' + error.message;
            } finally {
                loadingElement.classList.add('hidden');
            }
        }, 100);

    } catch (error) {
        console.error('Error in generateBlank3DView:', error);
        loadingElement.classList.add('hidden');
        shapeInfo.textContent = '毛坯3D视图初始化失败';
    }
}
/**
 * Create Blank 3D Model
 */
function createBlank3D() {
    try {
        const blankLength = calculationResults.blankLength;
        const blankWidth = calculationResults.blankWidth;
        const blankThickness = calculationResults.blankThickness;

        const scale = 0.064;
        const scaledLength = blankLength * scale;
        const scaledWidth = blankWidth * scale;
        const scaledThickness = blankThickness * scale;

        const geometry = new THREE.BoxGeometry(scaledLength, scaledThickness, scaledWidth, 16, 16, 16);
        const material = createBlankMaterial();
        const blank = new THREE.Mesh(geometry, material);

        blankScene.add(blank);
        currentBlank = blank;

        addBlankMagnetizationArrows(blank);
        adjustBlankCameraPosition();

        console.log('Blank created successfully with high precision');
    } catch (error) {
        console.error('Error creating blank:', error);
    }
}

/**
 * Add Blank Magnetization Arrows
 */
function addBlankMagnetizationArrows(blank) {
    const box = new THREE.Box3().setFromObject(blank);
    const size = box.getSize(new THREE.Vector3());

    const height = size.y;
    const offset = Math.max(size.x, size.y, size.z) * 0.15;

    const arrows = [];
    const topArrow = createBlankArrow(0, height / 2 + offset, 0, 0, 0, 0);
    arrows.push(topArrow);

    const bottomArrow = createBlankArrow(0, -height / 2 - offset, 0, Math.PI, 0, 0);
    arrows.push(bottomArrow);

    arrows.forEach(arrow => {
        arrow.userData.isMagnetizationIndicator = true;
        blankScene.add(arrow);
    });

    blank.userData.magnetizationArrows = arrows;
}

/**
 * Create Blank Arrow
 */
function createBlankArrow(x, y, z, rx, ry, rz) {
    const arrowLength = 1.2;
    const arrowColor = 0xFF0000;
    const headLength = 0.3;
    const headWidth = 0.2;

    const arrow = new THREE.ArrowHelper(
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, 0, 0),
        arrowLength,
        arrowColor,
        headLength,
        headWidth
    );

    arrow.position.set(x, y, z);
    arrow.rotation.set(rx, ry, rz);

    arrow.line.material.linewidth = 3;
    arrow.cone.material.color.setHex(0xFF0000);
    arrow.cone.material.transparent = true;
    arrow.cone.material.opacity = 0.9;

    return arrow;
}

/**
 * Adjust Blank Camera Position
 */
function adjustBlankCameraPosition() {
    if (!currentBlank) return;

    try {
        const box = new THREE.Box3().setFromObject(currentBlank);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = blankCamera.fov * (Math.PI / 180);
        let cameraDistance = maxDim / (2 * Math.tan(fov / 2));

        let cameraOffset = { x: 1, y: 1, z: 1 };

        blankCamera.position.copy(center);
        blankCamera.position.x += cameraDistance * cameraOffset.x;
        blankCamera.position.y += cameraDistance * cameraOffset.y;
        blankCamera.position.z += cameraDistance * cameraOffset.z;

        blankControls.target.copy(center);
        blankControls.update();

        const minDistance = cameraDistance * 0.5;
        const maxDistance = cameraDistance * 3;
        blankControls.minDistance = minDistance;
        blankControls.maxDistance = maxDistance;

    } catch (error) {
        console.error('Error adjusting blank camera position:', error);
        blankCamera.position.set(5, 5, 5);
        blankCamera.lookAt(0, 0, 0);
        blankControls.target.set(0, 0, 0);
        blankControls.update();
    }
}
/**
 * Create Circular Magnet 3D
 */
function createCircularMagnet3D() {
    try {
        const diameter = parseFloat(document.getElementById('circle-diameter').value);
        const thickness = parseFloat(document.getElementById('circle-thickness').value);

        const scale = 0.1;
        const radius = (diameter / 2) * scale;
        const height = thickness * scale;

        // Get user-defined corner radius (R角)
        const userCornerRadius = parseFloat(document.getElementById('square-corner-radius').value) || 0;
        const scaledCornerRadius = userCornerRadius * scale;

        // Use user-defined radius, but clamp it to avoid geometry errors
        // Max radius is half of thickness (height) or radius, whichever is smaller
        // We subtract a small epsilon to be safe
        const maxRadius = Math.min(height / 2, radius) - 0.001;

        // If user input is 0 or invalid, use a very small default for visual smoothness, or 0 for sharp edges?
        // User asked for "Radius set before", so if it's 0, it should probably be sharp or very small.
        // Let's stick to the user value, but ensure it's at least a tiny bit if they want a fillet, 
        // or just use 0 if they want sharp. But Lathe with 0 radius fillet might need logic adjustment.
        // The previous logic relies on filletRadius > 0 for the arc generation.
        // Let's ensure a minimum valid fillet for the code to work, or handle 0 explicitly.
        // For now, let's assume a minimum small value if 0 is entered to keep the "fillet" look logic working,
        // or better, just clamp the user value.

        let filletRadius = Math.max(0.001, Math.min(scaledCornerRadius, maxRadius));

        const segments = 64; // Radial segments
        const curveSegments = 12; // Segments for the fillet arc

        const points = [];

        // Generate profile points for LatheGeometry
        // Start from bottom center (0, -height/2)
        points.push(new THREE.Vector2(0, -height / 2));

        // Bottom flat part to start of fillet
        points.push(new THREE.Vector2(radius - filletRadius, -height / 2));

        // Bottom fillet (quarter circle)
        const bottomCenter = { x: radius - filletRadius, y: -height / 2 + filletRadius };
        for (let i = 0; i <= curveSegments; i++) {
            const theta = -Math.PI / 2 + (Math.PI / 2) * (i / curveSegments);
            points.push(new THREE.Vector2(
                bottomCenter.x + Math.cos(theta) * filletRadius,
                bottomCenter.y + Math.sin(theta) * filletRadius
            ));
        }

        // Top fillet (quarter circle)
        // Note: The vertical side is automatically created by connecting the end of bottom fillet to start of top fillet
        const topCenter = { x: radius - filletRadius, y: height / 2 - filletRadius };
        for (let i = 0; i <= curveSegments; i++) {
            const theta = 0 + (Math.PI / 2) * (i / curveSegments);
            points.push(new THREE.Vector2(
                topCenter.x + Math.cos(theta) * filletRadius,
                topCenter.y + Math.sin(theta) * filletRadius
            ));
        }

        // Top flat part to center
        points.push(new THREE.Vector2(0, height / 2));

        // Create Geometry
        const geometry = new THREE.LatheGeometry(points, segments);

        // Compute normals for smooth shading
        geometry.computeVertexNormals();

        const material = createMagnetMaterial();
        const magnet = new THREE.Mesh(geometry, material);

        scene.add(magnet);
        currentMagnet = magnet;

        adjustCameraPosition();

        console.log('Circular magnet with fillet created successfully');
    } catch (error) {
        console.error('Error creating circular magnet:', error);
    }
}

/**
 * Create Rounded Cylinder Geometry Helper
 */
function createRoundedCylinderGeometry(topRadius, bottomRadius, height, radialSegments = 32, heightSegments = 1, openEnd = false, chamferRadius = 0.1) {
    if (topRadius <= 0 || bottomRadius <= 0 || height <= 0) {
        return new THREE.CylinderGeometry(1, 1, 1, 32);
    }

    const safeRadialSegments = Math.max(8, Math.min(radialSegments, 128));
    const safeHeightSegments = Math.max(1, Math.min(heightSegments, 10));

    try {
        const minRadius = Math.min(topRadius, bottomRadius);
        const maxChamferSize = Math.min(chamferRadius, height * 0.15, minRadius * 0.3);
        const minChamferSize = 0.01;
        const chamferSize = Math.max(minChamferSize, maxChamferSize);

        const mainHeight = height - chamferSize * 2;
        const mainGeometry = new THREE.CylinderGeometry(topRadius, bottomRadius, mainHeight, safeRadialSegments, safeHeightSegments, openEnd);

        const topChamferGeometry = new THREE.CylinderGeometry(
            topRadius - chamferSize * 0.5,
            topRadius,
            chamferSize,
            safeRadialSegments,
            1,
            false
        );
        topChamferGeometry.translate(0, mainHeight / 2 + chamferSize / 2, 0);

        const bottomChamferGeometry = new THREE.CylinderGeometry(
            bottomRadius - chamferSize * 0.5,
            bottomRadius,
            chamferSize,
            safeRadialSegments,
            1,
            false
        );
        bottomChamferGeometry.translate(0, -mainHeight / 2 - chamferSize / 2, 0);

        if (THREE.BufferGeometryUtils && typeof THREE.BufferGeometryUtils.mergeBufferGeometries === 'function') {
            const merged = THREE.BufferGeometryUtils.mergeBufferGeometries([mainGeometry, topChamferGeometry, bottomChamferGeometry]);
            merged.computeBoundingBox();
            merged.computeVertexNormals();
            return merged;
        }

        const group = new THREE.Group();
        [mainGeometry, topChamferGeometry, bottomChamferGeometry].forEach(geo => {
            const mesh = new THREE.Mesh(geo, createMagnetMaterial());
            group.add(mesh);
        });
        return group;

    } catch (error) {
        console.error('Error in createRoundedCylinderGeometry:', error);
        return new THREE.CylinderGeometry(topRadius, bottomRadius, height, safeRadialSegments, safeHeightSegments, openEnd);
    }
}

/**
 * Create Square Magnet 3D
 */
function createSquareMagnet3D() {
    try {
        const length = parseFloat(document.getElementById('square-length').value);
        const width = parseFloat(document.getElementById('square-width').value);
        const thickness = parseFloat(document.getElementById('square-thickness').value);
        const cornerRadius = parseFloat(document.getElementById('square-corner-radius').value);

        const scale = 0.1;
        const scaledLength = length * scale;
        const scaledWidth = width * scale;
        const scaledThickness = thickness * scale;
        const scaledRadius = cornerRadius * scale;

        const geometry = createRoundedBoxGeometry(scaledLength, scaledWidth, scaledThickness, scaledRadius, 16);
        const material = createMagnetMaterial();
        const magnet = new THREE.Mesh(geometry, material);

        magnet.rotation.x = Math.PI / 2;

        scene.add(magnet);
        currentMagnet = magnet;

        adjustCameraPosition();

        console.log('Square magnet with rounded corners created successfully');
    } catch (error) {
        console.error('Error creating square magnet:', error);
    }
}

/**
 * Create Rounded Box Geometry Helper
 */
function createRoundedBoxGeometry(width, height, depth, radius = 0.1, segments = 8) {
    if (width <= 0 || height <= 0 || depth <= 0) {
        return new THREE.BoxGeometry(1, 1, 1);
    }

    try {
        const shape = new THREE.Shape();
        const halfWidth = width / 2;
        const halfHeight = height / 2;

        const maxRadius = Math.min(halfWidth, halfHeight, depth / 2);
        const minRadius = 0.001;
        const actualRadius = Math.max(minRadius, Math.min(radius, maxRadius * 0.8));

        const safeSegments = Math.max(2, Math.min(segments, 16));

        shape.moveTo(-halfWidth + actualRadius, -halfHeight);
        shape.lineTo(halfWidth - actualRadius, -halfHeight);
        shape.quadraticCurveTo(halfWidth, -halfHeight, halfWidth, -halfHeight + actualRadius);
        shape.lineTo(halfWidth, halfHeight - actualRadius);
        shape.quadraticCurveTo(halfWidth, halfHeight, halfWidth - actualRadius, halfHeight);
        shape.lineTo(-halfWidth + actualRadius, halfHeight);
        shape.quadraticCurveTo(-halfWidth, halfHeight, -halfWidth, halfHeight - actualRadius);
        shape.lineTo(-halfWidth, -halfHeight + actualRadius);
        shape.quadraticCurveTo(-halfWidth, -halfHeight, -halfWidth + actualRadius, -halfHeight);

        const extrudeSettings = {
            depth: depth,
            bevelEnabled: true,
            bevelThickness: Math.min(actualRadius, depth * 0.2),
            bevelSize: Math.min(actualRadius, Math.min(width, height) * 0.2),
            bevelSegments: Math.max(2, Math.min(safeSegments, 8)),
            curveSegments: safeSegments,
            steps: 1
        };

        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        geometry.center();
        geometry.computeBoundingBox();
        geometry.computeVertexNormals();

        return geometry;
    } catch (error) {
        console.error('Error in createRoundedBoxGeometry:', error);
        return new THREE.BoxGeometry(width, height, depth);
    }
}

/**
 * Create Ring Magnet 3D
 */
/**
 * Create Ring Magnet 3D
 */
function createRingMagnet3D() {
    try {
        const outerDiameter = parseFloat(document.getElementById('ring-outer-diameter').value);
        const innerDiameter = parseFloat(document.getElementById('ring-inner-diameter').value);
        const thickness = parseFloat(document.getElementById('ring-thickness').value);

        const scale = 0.1;
        const outerRadius = (outerDiameter / 2) * scale;
        const innerRadius = (innerDiameter / 2) * scale;
        const height = thickness * scale;

        // Get user-defined corner radius (R角)
        const userCornerRadius = parseFloat(document.getElementById('square-corner-radius').value) || 0;
        const scaledCornerRadius = userCornerRadius * scale;

        // Clamp fillet radius
        // Must be less than half the wall thickness and half the height
        const wallThickness = outerRadius - innerRadius;
        const maxFillet = Math.min(wallThickness / 2, height / 2) - 0.001;
        const filletRadius = Math.max(0.001, Math.min(scaledCornerRadius, maxFillet));

        const segments = 64; // Radial segments for revolution
        const curveSegments = 12; // Segments for the fillet arc
        const points = [];

        // Define profile points (Counter-Clockwise starting from bottom-inner)

        // 1. Bottom-Inner Corner (Inner face to Bottom face)
        // Center of the arc
        const biCenter = { x: innerRadius + filletRadius, y: -height / 2 + filletRadius };
        for (let i = 0; i <= curveSegments; i++) {
            const theta = Math.PI + (Math.PI / 2) * (i / curveSegments); // 180 to 270 deg
            points.push(new THREE.Vector2(
                biCenter.x + Math.cos(theta) * filletRadius,
                biCenter.y + Math.sin(theta) * filletRadius
            ));
        }

        // 2. Bottom Face (Inner to Outer) - automatically connected

        // 3. Bottom-Outer Corner (Bottom face to Outer face)
        const boCenter = { x: outerRadius - filletRadius, y: -height / 2 + filletRadius };
        for (let i = 0; i <= curveSegments; i++) {
            const theta = (Math.PI * 3 / 2) + (Math.PI / 2) * (i / curveSegments); // 270 to 360 deg
            points.push(new THREE.Vector2(
                boCenter.x + Math.cos(theta) * filletRadius,
                boCenter.y + Math.sin(theta) * filletRadius
            ));
        }

        // 4. Outer Face (Bottom to Top) - automatically connected

        // 5. Top-Outer Corner (Outer face to Top face)
        const toCenter = { x: outerRadius - filletRadius, y: height / 2 - filletRadius };
        for (let i = 0; i <= curveSegments; i++) {
            const theta = 0 + (Math.PI / 2) * (i / curveSegments); // 0 to 90 deg
            points.push(new THREE.Vector2(
                toCenter.x + Math.cos(theta) * filletRadius,
                toCenter.y + Math.sin(theta) * filletRadius
            ));
        }

        // 6. Top Face (Outer to Inner) - automatically connected

        // 7. Top-Inner Corner (Top face to Inner face)
        const tiCenter = { x: innerRadius + filletRadius, y: height / 2 - filletRadius };
        for (let i = 0; i <= curveSegments; i++) {
            const theta = (Math.PI / 2) + (Math.PI / 2) * (i / curveSegments); // 90 to 180 deg
            points.push(new THREE.Vector2(
                tiCenter.x + Math.cos(theta) * filletRadius,
                tiCenter.y + Math.sin(theta) * filletRadius
            ));
        }

        // 8. Inner Face (Top to Bottom) - automatically connected back to start
        // Close the loop explicitly to be sure
        points.push(points[0]);

        const geometry = new THREE.LatheGeometry(points, segments);
        geometry.computeVertexNormals();

        const material = createMagnetMaterial();
        const magnet = new THREE.Mesh(geometry, material);

        scene.add(magnet);
        currentMagnet = magnet;

        adjustCameraPosition();

        console.log('Ring magnet with fillets created successfully');
    } catch (error) {
        console.error('Error creating ring magnet:', error);
    }
}

/**
 * Create Rounded Ring Geometry Helper
 */
function createRoundedRingGeometry(outerRadius, innerRadius, height, radialSegments = 32, heightSegments = 1) {
    if (outerRadius <= innerRadius || outerRadius <= 0 || innerRadius < 0 || height <= 0) {
        return new THREE.RingGeometry(1, 2, 32);
    }

    const safeRadialSegments = Math.max(8, Math.min(radialSegments, 128));
    const safeHeightSegments = Math.max(1, Math.min(heightSegments, 10));

    try {
        const geometry = new THREE.RingGeometry(innerRadius, outerRadius, safeRadialSegments, 0, Math.PI * 2);

        const maxChamferSize = Math.min(height * 0.15, (outerRadius - innerRadius) * 0.2);
        const minChamferSize = 0.01;
        const chamferSize = Math.max(minChamferSize, maxChamferSize);

        const extrudeSettings = {
            depth: height,
            bevelEnabled: true,
            bevelThickness: chamferSize,
            bevelSize: chamferSize,
            bevelSegments: Math.min(4, Math.max(2, Math.floor(safeRadialSegments / 8))),
            curveSegments: safeRadialSegments,
            steps: safeHeightSegments
        };

        const extrudedGeometry = new THREE.ExtrudeGeometry(geometry, extrudeSettings);
        extrudedGeometry.center();
        extrudedGeometry.computeBoundingBox();
        extrudedGeometry.computeVertexNormals();

        return extrudedGeometry;
    } catch (error) {
        console.error('Error in createRoundedRingGeometry:', error);
        return new THREE.RingGeometry(innerRadius, outerRadius, safeRadialSegments);
    }
}

/**
 * Create Magnet Material
 */
function createMagnetMaterial() {
    try {
        const materialParams = {
            color: 0x9CA3AF,
            transparent: false,
            opacity: 1.0,
            side: THREE.DoubleSide,
            flatShading: false,
            precision: 'highp',
            aoMapIntensity: 0.5,
            metalness: 0.7,
            roughness: 0.3,
        };

        const material = new THREE.MeshStandardMaterial(materialParams);

        if (isWireframeMode) {
            material.wireframe = true;
            material.wireframeLinewidth = 2;
            material.color.setHex(0x9CA3AF);
        }

        return material;
    } catch (error) {
        console.error('Error creating magnet material:', error);
        return new THREE.MeshBasicMaterial({ color: 0x9CA3AF });
    }
}

/**
 * Create Blank Material
 */
function createBlankMaterial() {
    try {
        console.log('Creating blank material with MeshStandardMaterial');
        const materialParams = {
            color: 0x4A5568,
            transparent: false,
            opacity: 1.0,
            side: THREE.DoubleSide,
            flatShading: false,
            precision: 'highp',
            aoMapIntensity: 0.3,
            metalness: 0.4,
            roughness: 0.6,
        };

        const material = new THREE.MeshStandardMaterial(materialParams);

        if (isWireframeMode) {
            material.wireframe = true;
            material.wireframeLinewidth = 2;
            material.color.setHex(0x4A5568);
        }

        return material;
    } catch (error) {
        console.error('Error creating blank material:', error);
        return new THREE.MeshBasicMaterial({ color: 0x4A5568 });
    }
}

/**
 * Add Orientation Indicator
 */
function addOrientationIndicator(orientation) {
    scene.children.forEach(child => {
        if (child.userData.isOrientationIndicator) {
            scene.remove(child);
        }
    });

    if (!currentMagnet) return;

    const box = new THREE.Box3().setFromObject(currentMagnet);
    const size = box.getSize(new THREE.Vector3());

    const width = size.x;
    const height = size.y;
    const depth = size.z;

    let actualWidth = width;
    let actualHeight = height;
    let actualDepth = depth;

    if (calculationResults.shape === 'circle') {
        actualWidth = width;
        actualHeight = height;
        actualDepth = depth;
    } else if (calculationResults.shape === 'ring') {
        actualWidth = width;
        actualHeight = height;
        actualDepth = depth;
    }

    // Position arrows at edge with minimal offset
    const edgeOffset = 0.05; // Very small offset from edge
    let arrows = [];

    switch (orientation) {
        case 'axial':
            // Arrows along Y-axis (height), length based on height
            const axialArrowLength = actualHeight * 1.2;
            arrows.push(createArrow(0, actualHeight / 2 + edgeOffset, 0, 0, 0, 0, axialArrowLength));
            arrows.push(createArrow(0, -actualHeight / 2 - edgeOffset, 0, Math.PI, 0, 0, axialArrowLength));
            break;

        case 'radial':
            // Arrows along X-axis (width), length based on width
            const radialArrowLength = actualWidth * 1.2;
            arrows.push(createArrow(actualWidth / 2 + edgeOffset, 0, 0, 0, Math.PI / 2, 0, radialArrowLength));
            arrows.push(createArrow(-actualWidth / 2 - edgeOffset, 0, 0, 0, -Math.PI / 2, 0, radialArrowLength));
            break;

        case 'multi-pole':
            // 4 arrows around perimeter, length based on average dimension
            const multiPoleArrowLength = Math.max(actualWidth, actualHeight) * 0.8;
            for (let i = 0; i < 4; i++) {
                const angle = (i * Math.PI / 2);
                const x = Math.cos(angle) * (actualWidth / 2 + edgeOffset);
                const y = Math.sin(angle) * (actualHeight / 2 + edgeOffset);
                arrows.push(createArrow(x, y, 0, 0, 0, angle + Math.PI / 2, multiPoleArrowLength));
            }
            break;

        case 'diametral':
            const diametralArrowLength = actualWidth * 1.2;
            if (calculationResults.shape === 'ring') {
                const innerRadius = actualWidth / 4;
                const outerRadius = actualWidth / 2;
                arrows.push(createArrow(outerRadius + edgeOffset, 0, 0, 0, Math.PI / 2, 0, diametralArrowLength));
                arrows.push(createArrow(-outerRadius - edgeOffset, 0, 0, 0, -Math.PI / 2, 0, diametralArrowLength));
                arrows.push(createArrow(innerRadius - edgeOffset, 0, 0, 0, Math.PI / 2, 0, diametralArrowLength * 0.6));
                arrows.push(createArrow(-innerRadius + edgeOffset, 0, 0, 0, -Math.PI / 2, 0, diametralArrowLength * 0.6));
            } else {
                arrows.push(createArrow(actualWidth / 2 + edgeOffset, 0, 0, 0, Math.PI / 2, 0, diametralArrowLength));
                arrows.push(createArrow(-actualWidth / 2 - edgeOffset, 0, 0, 0, -Math.PI / 2, 0, diametralArrowLength));
            }
            break;
    }

    arrows.forEach(arrow => {
        arrow.userData.isOrientationIndicator = true;
        scene.add(arrow);
    });
}

/**
 * Create Arrow Helper
 */
function createArrow(x, y, z, rx, ry, rz, arrowLength = 1.5) {
    const arrowColor = 0xff0000;
    // Make head proportional to arrow length
    const headLength = arrowLength * 0.25;
    const headWidth = arrowLength * 0.15;

    const arrow = new THREE.ArrowHelper(
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, 0, 0),
        arrowLength,
        arrowColor,
        headLength,
        headWidth
    );

    arrow.position.set(x, y, z);
    arrow.rotation.set(rx, ry, rz);

    arrow.line.material.linewidth = 3;
    arrow.cone.material.color.setHex(0xff0000);
    arrow.cone.material.transparent = true;
    arrow.cone.material.opacity = 0.9;

    return arrow;
}

/**
 * Adjust Camera Position
 */
function adjustCameraPosition() {
    if (!currentMagnet) return;

    try {
        const box = new THREE.Box3().setFromObject(currentMagnet);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        let cameraDistance = maxDim / (2 * Math.tan(fov / 2));

        let cameraOffset = { x: 1, y: 1, z: 1 };

        camera.position.copy(center);
        camera.position.x += cameraDistance * cameraOffset.x;
        camera.position.y += cameraDistance * cameraOffset.y;
        camera.position.z += cameraDistance * cameraOffset.z;

        controls.target.copy(center);
        controls.update();

        const minDistance = cameraDistance * 0.5;
        const maxDistance = cameraDistance * 3;
        controls.minDistance = minDistance;
        controls.maxDistance = maxDistance;

    } catch (error) {
        console.error('Error adjusting camera position:', error);
        camera.position.set(5, 5, 5);
        camera.lookAt(0, 0, 0);
        controls.target.set(0, 0, 0);
        controls.update();
    }
}
