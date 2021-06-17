$(document).ready(function () {
    var detailsBlock = $('.cv-details');
    var cvSections = $('.details-description');
    var sectionTitle = $('.details-header h2');
    var closeButton = $('.btn-close');
    var menuOptions = $('.cv-section');

    menuOptions.click(function () {
        // Set section title
        sectionTitle.text($(this).text());

        // Show details block
        detailsBlock.addClass('show');

        // Hide all sections
        cvSections.addClass('hidden');

        // Show selected section
        var menuId = $(this).attr('id');
        var sectionId = menuId.replace('menu_', '');

        if (sectionId.length) {
            $('#' + sectionId).removeClass('hidden');
        }

        // Uncheck all left menu options
        menuOptions.removeClass('active');

        // Check selected left menu option
        $(this).addClass('active');
    })

    closeButton.click(function () {
        // Hide details block
        detailsBlock.removeClass('show');

        // Uncheck all left menu options
        menuOptions.removeClass('active');
    })

    menuOptions.eq(0).trigger('click');
});