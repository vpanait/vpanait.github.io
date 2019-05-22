$(function() {
    let animationData = [{
            "step": 0.01,
            "status": "In Progress",
            "red": 5308.6,
            "yellow": 5400,
            "green": null,
            "target": 5588
        },
        {
            "step": 0.02,
            "status": "In Progress",
            "red": 5308.6,
            "yellow": 5390,
            "green": null,
            "target": 5588
        },
        {
            "step": 0.03,
            "status": "Exit",
            "red": 5328.6,
            "yellow": 5410,
            "green": null,
            "target": 5588
        },
        {
            "step": 0.04,
            "status": "In Progress",
            "red": 5328.6,
            "yellow": 5350,
            "green": null,
            "target": 5588
        },
        {
            "step": 0.05,
            "status": "In Progress",
            "red": 5438.6,
            "yellow": 5460,
            "green": null,
            "target": 5588
        },
        {
            "step": 0.06,
            "status": "Expired",
            "red": 5458.6,
            "yellow": 5480,
            "green": null,
            "target": 5588
        },
        {
            "step": 0.07,
            "status": "In Progress",
            "red": 5458.6,
            "yellow": 5460,
            "green": null,
            "target": 5588
        },
        {
            "step": 0.08,
            "status": "In Progress",
            "red": 5488.6,
            "yellow": 5490,
            "green": null,
            "target": 5588
        },
        {
            "step": 0.09,
            "status": "Error",
            "red": 5200,
            "yellow": 5540,
            "green": null,
            "target": 5588
        },
        {
            "step": 0.1,
            "status": "In Progress",
            "red": null,
            "yellow": 5590,
            "green": 5478.24,
            "target": 5588
        },
        {
            "step": 0.11,
            "status": "In Progress",
            "red": null,
            "yellow": 5520,
            "green": 5478.24,
            "target": 5588
        },
        {
            "step": 0.12,
            "status": "Cancelled",
            "red": null,
            "yellow": 5500,
            "green": 5478.24,
            "target": 5588
        },
        {
            "step": 0.13,
            "status": "In Progress",
            "red": null,
            "yellow": 5590,
            "green": 5568.24,
            "target": 5588
        },
        {
            "step": 0.14,
            "status": "In Progress",
            "red": null,
            "yellow": 5620,
            "green": 5598.24,
            "target": 5588
        },
        {
            "step": 0.15,
            "status": "In Progress",
            "red": null,
            "yellow": 5900,
            "green": 5678.24,
            "target": 5588
        },
        {
            "step": 0.16,
            "status": "Completed",
            "red": null,
            "yellow": 5640,
            "green": 5678.24,
            "target": 5588
        }
    ];

    let animationDuration = 800;
    let yellowDotStatusClasses = {
        'in-progress': '',
        'completed': 'fas fa-thumbs-up',
        'exit': 'fas fa-thumbs-down',
        'expired': 'fas fa-unlink',
        'error': 'fas fa-bug',
        'cancelled': 'fas fa-ban',
    }

    let scaleMin = null;
    let scaleMax = null;
    let previousStep = 0;
    let currentStep = 0;

    // Cache DOM elements
    let container = $('.animation-container');

    let cylinder = container.find('.cylinder');
    let redDot = container.find('.dot.red');
    let yellowDot = container.find('.dot.yellow');
    let greenDot = container.find('.dot.green');
    let targetDot = container.find('.dot.target');
    let allDots = container.find('.dot');

    let redLabel = redDot.find('.label');
    let yellowLabel = yellowDot.find('.label');
    let greenLabel = greenDot.find('.label');
    let targetLabel = targetDot.find('.label');

    let totalSteps = animationData.length;

    let startButton = container.find('.button.start');
    let prevButton = container.find('.button.prev');
    let nextButton = container.find('.button.next');
    let scaleMinDiv = container.find('.scale-min');
    let scaleMaxDiv = container.find('.scale-max');

    let dataTable = container.find('.animation-data table');


    populateTable();

    startButton.on('click', function() {
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

    allDots.on({
        mouseenter: function() {
            $(this).find(".label").removeClass('hidden');
        },
        mouseleave: function() {
            $(this).find(".label").addClass('hidden');
        }
    });


    function updateCurrentStep(stepValue) {
        let dataSet = animationData[stepValue - 1];

        let dots = [redDot, yellowDot, greenDot, targetDot];
        let labels = [redLabel, yellowLabel, greenLabel, targetLabel];
        let coords = [dataSet.red, dataSet.yellow, dataSet.green, dataSet.target];
        let globalAnimationTimeNeed = 0;
        let dotsLeftOffsets = [];
        let newDotAppeared = false;
        let scaleChanged = false;

        previousStep = currentStep;
        currentStep = stepValue;

        // Disable navigation buttons before animation 
        disableNavigationBottons();

        // Calculate scale min max 
        let newScaleValues = calculateScaleMinMaxValues(coords);
        if (scaleMin != newScaleValues.min) {
            scaleMin = newScaleValues.min;
            scaleChanged = true;
        }
        if (scaleMax != newScaleValues.max) {
            scaleMax = newScaleValues.max;
            scaleChanged = true;
        }

        // Update scale min and max values
        scaleMinDiv.removeClass('hidden').text(formatNumber(scaleMin));
        scaleMaxDiv.removeClass('hidden').text(formatNumber(scaleMax));

        // Update dots state + position
        for (let i = 0; i < dots.length; i++) {
            let currentDot = dots[i];
            let currentLabel = labels[i];
            let currentCoord = coords[i];

            // No animation if it is initialization
            let dotAnimDuration = (previousStep === 0) ? 0 : animationDuration;

            // Hide dot if no data | Hide target if scale change
            if (currentCoord == null) {
                currentDot.addClass('hidden');
            }
            if (currentDot.hasClass('target') && scaleChanged) {
                currentDot.addClass('invisible');
            }

            globalAnimationTimeNeed = Math.max(globalAnimationTimeNeed, dotAnimDuration);

            if (currentDot.hasClass('hidden') && currentCoord != null && previousStep !== 0) {
                newDotAppeared = true;
            }

            // Animate position
            if (currentCoord != null) {
                let leftOffset = calculateOffsetValue(currentCoord, coords);
                dotsLeftOffsets[i] = leftOffset;

                currentDot.animate({ "left": leftOffset + "%" },
                    dotAnimDuration,
                    () => {
                        if (currentDot.hasClass('hidden') || currentDot.hasClass('invisible')) {
                            currentDot.removeClass('hidden').removeClass('invisible');
                        }

                        // Update dots values
                        if (i === 1) {
                            currentLabel.find('.status').text(dataSet.status);
                            currentLabel.find('.value').text(formatNumber(currentCoord));

                            // Add class name for yellow dot
                            let newClassName = toCssClass(dataSet.status);
                            if (currentDot.data('status')) {
                                currentDot.removeClass(currentDot.data('status'));
                            }
                            currentDot.addClass(newClassName);
                            currentDot.data('status', newClassName);

                            currentDot.find('i').removeClass().addClass(yellowDotStatusClasses[newClassName]);
                        } else {
                            currentLabel.text(formatNumber(currentCoord))
                        }
                    }
                );
            }
        }

        // Animate cylinder
        let cylinderData = getCylinderData(dotsLeftOffsets);
        let cylinderAnimationDelay = newDotAppeared ? globalAnimationTimeNeed : 0;

        if (newDotAppeared) {
            cylinder.addClass('hidden').css("display", "none");
        }

        setTimeout(function() {
            cylinder.animate({
                    "left": cylinderData.leftMin + "%",
                    "width": cylinderData.width + "%"
                },
                (previousStep === 0 || newDotAppeared) ? 0 : globalAnimationTimeNeed,
                () => {
                    if (cylinder.hasClass('hidden')) {
                        cylinder.removeClass('hidden').css("display", "block");
                    }
                }
            );
        }, cylinderAnimationDelay);


        // Update table selected row
        dataTable.find('tr').removeClass('active');
        dataTable.find('tr').eq(currentStep).addClass('active');

        // Update navigation buttons state after animation
        setTimeout(function() {
            updateNavigationBottonsState();
        }, globalAnimationTimeNeed);
    }

    function updateNavigationBottonsState() {
        if (currentStep == null) {
            prevButton.addClass('disabled');
            nextButton.addClass('disabled');
        } else if (currentStep <= 1) {
            prevButton.addClass('disabled');
            nextButton.removeClass('disabled');
        } else if (currentStep >= totalSteps) {
            prevButton.removeClass('disabled');
            nextButton.addClass('disabled');
        } else {
            prevButton.removeClass('disabled');
            nextButton.removeClass('disabled');

        }
    }

    function disableNavigationBottons() {
        prevButton.addClass('disabled');
        nextButton.addClass('disabled');
    }

    function calculateOffsetValue(coordValue, coords) {
        let scaleLength = scaleMax - scaleMin;
        let offsetAbsoluteValue = coordValue - scaleMin;
        return offsetAbsoluteValue / scaleLength * 100;
    }

    function calculateScaleMinMaxValues(coords) {
        // Compute min and max for the scale
        let nonNullCoords = coords.filter(function(val) {
            return val !== null
        });
        let result = {
            min: scaleMin,
            max: scaleMax
        }

        let valMin = Math.min(...nonNullCoords);
        let valMax = Math.max(...nonNullCoords);

        if (!scaleMin || valMin < scaleMin) {
            result.min = valMin * 0.98;
        }
        if (!scaleMax || valMax > scaleMax) {
            result.max = valMax * 1.05;
        }

        return result;
    }

    function getCylinderData(dotsLeftOffsets) {
        let dotsOffsets = dotsLeftOffsets.slice(0, 3).filter(function(val) {
            return val !== null
        });

        let leftMin = Math.min(...dotsOffsets);
        let leftMax = Math.max(...dotsOffsets);

        return {
            leftMin: leftMin,
            leftMax: leftMax,
            width: leftMax - leftMin
        }
    }

    function populateTable() {
        let htmlCode = '';
        dataTable.find("tbody tr").remove();
        for (let dataSet of animationData) {
            htmlCode += '<tr>';
            for (let val of Object.values(dataSet)) {
                htmlCode += '<td>' + (val ? formatNumber(val) : '&nbsp;') + '</td>';
            }
            htmlCode += '</tr>';
        }
        dataTable.find("tbody").append(htmlCode);
    }

    function formatNumber(value) {
        if (isNumber(value)) {
            value = value.toFixed(2);
        }
        return value;
    }

    function roundToDecimals(value, howMany) {
        if (isNumber(value)) {
            return Math.round(value * Math.pow(10, howMany)) / Math.pow(10, howMany);
        }
        return value;
    }

    function isNumber(value) {
        return value && !isNaN(value);
    }

    function toCssClass(value) {
        if (value) {
            return value.replace(/\s+/g, '-').toLowerCase();
        }
        return value;
    }

});