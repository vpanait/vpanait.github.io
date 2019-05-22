$(function() {
    var scaleMin = 5288.60;
    var scaleMax = 5720.00;
    var animationDuration = 800;

    var redCoords = [
        5308.60, 5308.60, 5328.60, 5328.60, 5438.60, 5458.60, 5458.60, 5488.60, 5538.60, 0, 0, 0, 0, 0, 0, 0, 0
    ];
    var yellowCoords = [
        5400.00, 5390.00, 5410.00, 5350.00, 5460.00, 5480.00, 5460.00, 5490.00, 5540.00, 5590.00, 5520.00, 5500.00, 5590.00, 5620.00, 5700.00, 5640.00, 5610.00
    ];
    var greenCoords = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 5478.24, 5478.24, 5478.24, 5500.00, 5590.00, 5620.00, 5620.00, 5620.00
    ];

    var targetCoords = [
        5588.00, 5588.00, 5588.00, 5588.00, 5588.00, 5588.00, 5588.00, 5588.00, 5588.00, 5588.00, 5588.00, 5588.00, 5588.00, 5588.00, 5588.00, 5588.00, 5588.00
    ]

    // Verify that we have the same number of steps
    if (!areEqual(redCoords.length, yellowCoords.length, greenCoords.length, targetCoords.length)) {
        // console.log(' >> Please check data consistency');
    }

    var container = $('.animation-container');
    var redDot = container.find('.dot.red');
    var yellowDot = container.find('.dot.yellow');
    var greenDot = container.find('.dot.green');
    var targetDot = container.find('.dot.target');

    var totalSteps = targetCoords.length;

    var startButton = container.find('.button.start');
    var prevButton = container.find('.button.prev');
    var nextButton = container.find('.button.next');

    var dataTable = container.find('.animation-data table');

    var previousStep = 0;
    var currentStep = 0;

    startButton.on('click', function() {
        container.find('.info-progress').removeClass('invisible');
        prevButton.removeClass('invisible')
        nextButton.removeClass('invisible')
        updateCurrentStep(1);
    });

    prevButton.on('click', function() {
        if (currentStep > 1) {
            currentStep -= 1;
            updateCurrentStep(currentStep);
        }
    });

    nextButton.on('click', function() {
        if (currentStep < totalSteps) {
            currentStep += 1;
            updateCurrentStep(currentStep);
        }
    });

    function updateCurrentStep(stepValue) {
        var dots = [redDot, yellowDot, greenDot, targetDot];
        var coords = [redCoords, yellowCoords, greenCoords, targetCoords];

        previousStep = currentStep;
        currentStep = stepValue;

        // Update dots state + position
        for (var i = 0; i < dots.length; i++) {
            var currentDot = dots[i];
            var currentCoordsSet = coords[i];
            var currentCoord = currentCoordsSet[currentStep - 1];
            var dotAnimDuration = animationDuration;

            // State
            if (currentDot.hasClass('hidden') && currentCoord != 0) {
                dotAnimDuration = 0;
                currentDot.removeClass('hidden');
            }
            if (currentCoord == 0) {
                currentDot.addClass('hidden');
            }

            // No animation if it is initialization
            if (previousStep === 0) {
                dotAnimDuration = 0;
            }

            // Position
            if (currentCoord != 0) {
                currentDot.animate({ "left": calculateOffsetValue(currentCoord) + "%" }, dotAnimDuration);
            }
        }

        // Update table selected row
        dataTable.find('tr').removeClass('active');
        dataTable.find('tr').eq(currentStep).addClass('active');
    }


    function areEqual() {
        var len = arguments.length;
        for (var i = 1; i < len; i++) {
            if (arguments[i] === null || arguments[i] !== arguments[i - 1])
                return false;
        }
        return true;
    }

    function calculateOffsetValue(coordValue) {
        var scaleLength = scaleMax - scaleMin;
        var offsetAbsoluteValue = coordValue - scaleMin;
        return offsetAbsoluteValue / scaleLength * 100;
    }
});