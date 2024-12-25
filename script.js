// Show the home image
function showHomeImage() {
    const homeImage = document.getElementById('homeImage');
    if (homeImage) {
        homeImage.classList.remove('hidden');
    }
}

// Hide the home image
function hideHomeImage() {
    const homeImage = document.getElementById('homeImage');
    if (homeImage) {
        homeImage.classList.add('hidden');
    }
}

// Select the Go Back button
const goBackButton = document.getElementById('goBack');

// Reset Second Semester Table and State
function resetSecondSemester() {
    const gradeInputs = document.querySelectorAll('.gradeInput');
    gradeInputs.forEach(input => {
        input.value = ''; // Clear inputs
    });
    document.getElementById('semester2Warning').style.display = 'none'; // Hide warnings
    document.getElementById('semester2Result').style.display = 'none'; // Hide results
}

// Hide all sections
function hideAllSections() {
    const sections = [
        'semester1Science',
        'semester1Literary',
        'semester2Science',
        'semester2Literary',
        'pathSelection'
    ];
    sections.forEach(id => {
        document.getElementById(id).style.display = 'none';
    });
}

// Show Go Back button and set its callback
function showGoBackButton(callback) {
    goBackButton.style.display = 'block';
    goBackButton.onclick = callback;
}

// Hide the Go Back button
function hideGoBackButton() {
    goBackButton.style.display = 'none';
    goBackButton.onclick = null;
}

let accessedFromSemester2Direct = false; // Flag to track how we accessed semester 2

// Show Start Page and hide all other sections
function showStartPage() {
    hideAllSections();
    document.getElementById('start').style.display = 'block';
    showHomeImage();
    hideGoBackButton();
}

// Show Path Selection Page and hide all other sections
function showPathSelectionPage() {
    hideAllSections();
    document.getElementById('pathSelection').style.display = 'block';
    showGoBackButton(showStartPage);
}

// Show First Semester Section
document.getElementById('firstSemester').addEventListener('click', function () {
    hideHomeImage(); // Hide image when navigating to the first semester
    document.getElementById('start').style.display = 'none';
    showPathSelectionPage();
    sessionStorage.setItem('semester', 'first');
});

// Show Second Semester Section Directly
document.getElementById('secondSemester').addEventListener('click', function () {
    hideHomeImage(); // Hide image when navigating to the second semester
    accessedFromSemester2Direct = true; // Direct access
    document.getElementById('start').style.display = 'none';
    showPathSelectionPage();
    sessionStorage.setItem('semester', 'second');
});

// Show Science Path
document.getElementById('sciencePath').addEventListener('click', function () {
    hideAllSections();
    const semester = sessionStorage.getItem('semester');
    if (semester === 'first') {
        document.getElementById('semester1Science').style.display = 'block';
    } else if (semester === 'second') {
        document.getElementById('semester2Science').style.display = 'block';
        // Show the input box for the first semester percentage
        document.getElementById('semester1PercentageContainerScience').style.display = 'block';
    }
    showGoBackButton(showPathSelectionPage);
});

// Show Literary Path
document.getElementById('literaryPath').addEventListener('click', function () {
    hideAllSections();
    const semester = sessionStorage.getItem('semester');
    if (semester === 'first') {
        document.getElementById('semester1Literary').style.display = 'block';
    } else if (semester === 'second') {
        document.getElementById('semester2Literary').style.display = 'block';
        // Show the input box for the first semester percentage
        document.getElementById('semester1PercentageContainerLiterary').style.display = 'block';
    }
    showGoBackButton(showPathSelectionPage);
});

// Calculate First Semester Science Grades
document.getElementById('calculateSemester1Science').addEventListener('click', function () {
    const gradeInputs = document.querySelectorAll('#semester1TableScience .gradeInput');
    let total = 0;
    let allFilled = true;

    gradeInputs.forEach(input => {
        const value = parseFloat(input.value);
        if (isNaN(value) || value < 0 || value > parseFloat(input.dataset.max)) {
            allFilled = false;
        } else {
            total += value;
        }
    });

    const warning = document.getElementById('semester1WarningScience');
    const result = document.getElementById('semester1ResultScience');
    const predictButton = document.getElementById('predictFinalScience');

    if (!allFilled) {
        warning.style.display = 'block';
        warning.textContent = 'يرجى إدخال درجات صحيحة لجميع المواد (من 0 إلى 40).';
        result.style.display = 'none';
        predictButton.style.display = 'none';
    } else {
        warning.style.display = 'none';
        const percentage = ((total / 320) * 100).toFixed(2); // Calculate percentage
        result.style.display = 'block';
        result.textContent = `معدل الفصل الدراسي الأول : ${percentage}%`;
        predictButton.style.display = 'block';
    }
});

// Calculate First Semester Literary Grades
document.getElementById('calculateSemester1Literary').addEventListener('click', function () {
    const gradeInputs = document.querySelectorAll('#semester1TableLiterary .gradeInput');
    let total = 0;
    let allFilled = true;

    gradeInputs.forEach(input => {
        const value = parseFloat(input.value);
        if (isNaN(value) || value < 0 || value > parseFloat(input.dataset.max)) {
            allFilled = false;
        } else {
            total += value;
        }
    });

    const warning = document.getElementById('semester1WarningLiterary');
    const result = document.getElementById('semester1ResultLiterary');
    const predictButton = document.getElementById('predictFinalLiterary');

    if (!allFilled) {
        warning.style.display = 'block';
        warning.textContent = 'يرجى إدخال درجات صحيحة لجميع المواد (من 0 إلى 40).';
        result.style.display = 'none';
        predictButton.style.display = 'none';
    } else {
        warning.style.display = 'none';
        const percentage = ((total / 320) * 100).toFixed(2); // Calculate percentage
        result.style.display = 'block';
        result.textContent = `معدل الفصل الدراسي الأول : ${percentage}%`;
        predictButton.style.display = 'block';
    }
});

// Predict Final Total for Science
document.getElementById('predictFinalScience').addEventListener('click', function () {
    const semester1Result = document.getElementById('semester1ResultScience').textContent || '';
    const semester1Percentage = parseFloat(semester1Result.split(':')[1]?.trim() || 0);

    if (isNaN(semester1Percentage)) {
        alert('يرجى حساب النسبة المئوية للفصل الدراسي الأول قبل التوقع بالمجموع النهائي.');
        return;
    }

    // Show second semester section and pre-fill the percentage
    document.getElementById('semester1Science').style.display = 'none';
    document.getElementById('semester2Science').style.display = 'block';
    const semester1PercentageInput = document.getElementById('semester1PercentageScience');
    semester1PercentageInput.value = semester1Percentage;
    semester1PercentageInput.setAttribute('readonly', 'true'); // Make it read-only

    // Hide the container since it is pre-filled
    document.getElementById('semester1PercentageContainerScience').style.display = 'none';

    // Update Go Back button behavior
    showGoBackButton(() => {
        document.getElementById('semester2Science').style.display = 'none';
        document.getElementById('semester1Science').style.display = 'block';
        showGoBackButton(showPathSelectionPage);
    });
});

// Predict Final Total for Literary
document.getElementById('predictFinalLiterary').addEventListener('click', function () {
    const semester1Result = document.getElementById('semester1ResultLiterary').textContent || '';
    const semester1Percentage = parseFloat(semester1Result.split(':')[1]?.trim() || 0);

    if (isNaN(semester1Percentage)) {
        alert('يرجى حساب النسبة المئوية للفصل الدراسي الأول قبل التوقع بالمجموع النهائي.');
        return;
    }

    // Show second semester section and pre-fill the percentage
    document.getElementById('semester1Literary').style.display = 'none';
    document.getElementById('semester2Literary').style.display = 'block';
    const semester1PercentageInput = document.getElementById('semester1PercentageLiterary');
    semester1PercentageInput.value = semester1Percentage;
    semester1PercentageInput.setAttribute('readonly', 'true'); // Make it read-only

    // Hide the container since it is pre-filled
    document.getElementById('semester1PercentageContainerLiterary').style.display = 'none';

    // Update Go Back button behavior
    showGoBackButton(() => {
        document.getElementById('semester2Literary').style.display = 'none';
        document.getElementById('semester1Literary').style.display = 'block';
        showGoBackButton(showPathSelectionPage);
    });
});

// Calculate Final Total After Second Semester for Science
document.getElementById('calculateSemester2Science').addEventListener('click', function () {
    const semester1PercentageInput = document.getElementById('semester1PercentageScience');
    const semester1PercentageWarning = document.getElementById('semester1PercentageWarningScience');
    const semester1Percentage = parseFloat(semester1PercentageInput.value);

    // Validate the first semester percentage
    if (isNaN(semester1Percentage) || semester1Percentage < 0 || semester1Percentage > 100) {
        semester1PercentageWarning.style.display = 'block';
        semester1PercentageWarning.textContent = 'يرجى إدخال نسبة صحيحة للفصل الدراسي الأول (من 0 إلى 100).';
        return;
    } else {
        semester1PercentageWarning.style.display = 'none';
    }

    const semester1Total = (semester1Percentage / 100) * 320; // Calculate semester 1 total from percentage
    const gradeInputs = document.querySelectorAll('#semester2TableScience .gradeInput');
    let semester2Total = 0;
    let allFilled = true;

    // Loop through the second semester grades
    gradeInputs.forEach(input => {
        const value = parseFloat(input.value);
        if (isNaN(value) || value < 0 || value > parseFloat(input.dataset.max)) {
            allFilled = false;
        } else {
            semester2Total += value;
        }
    });

    const warning = document.getElementById('semester2WarningScience');
    const result = document.getElementById('semester2ResultScience');

    // Check if all second semester grades are filled
    if (!allFilled) {
        warning.style.display = 'block';
        warning.textContent = 'يرجى إدخال درجات صحيحة لجميع المواد (من 0 إلى 60).';
        result.style.display = 'none';
    } else {
        warning.style.display = 'none';
        const finalTotal = semester1Total + semester2Total; // Combine totals
        const finalPercentage = ((finalTotal / 800) * 100).toFixed(2); // Calculate final percentage
        result.style.display = 'block';
        const isPrediction = accessedFromSemester2Direct ? "" : "المتوقعة ";
        result.textContent = `النسبة الإجمالية ${isPrediction}للمجموع النهائي هي: ${finalPercentage}%`;
    }
});

// Calculate Final Total After Second Semester for Literary
document.getElementById('calculateSemester2Literary').addEventListener('click', function () {
    const semester1PercentageInput = document.getElementById('semester1PercentageLiterary');
    const semester1PercentageWarning = document.getElementById('semester1PercentageWarningLiterary');
    const semester1Percentage = parseFloat(semester1PercentageInput.value);

    // Validate the first semester percentage
    if (isNaN(semester1Percentage) || semester1Percentage < 0 || semester1Percentage > 100) {
        semester1PercentageWarning.style.display = 'block';
        semester1PercentageWarning.textContent = 'يرجى إدخال نسبة صحيحة للفصل الدراسي الأول (من 0 إلى 100).';
        return;
    } else {
        semester1PercentageWarning.style.display = 'none';
    }

    const semester1Total = (semester1Percentage / 100) * 320; // Calculate semester 1 total from percentage
    const gradeInputs = document.querySelectorAll('#semester2TableLiterary .gradeInput');
    let semester2Total = 0;
    let allFilled = true;

    // Loop through the second semester grades
    gradeInputs.forEach(input => {
        const value = parseFloat(input.value);
        if (isNaN(value) || value < 0 || value > parseFloat(input.dataset.max)) {
            allFilled = false;
        } else {
            semester2Total += value;
        }
    });

    const warning = document.getElementById('semester2WarningLiterary');
    const result = document.getElementById('semester2ResultLiterary');

    // Check if all second semester grades are filled
    if (!allFilled) {
        warning.style.display = 'block';
        warning.textContent = 'يرجى إدخال درجات صحيحة لجميع المواد (من 0 إلى 60).';
        result.style.display = 'none';
    } else {
        warning.style.display = 'none';
        const finalTotal = semester1Total + semester2Total; // Combine totals
        const finalPercentage = ((finalTotal / 800) * 100).toFixed(2); // Calculate final percentage
        result.style.display = 'block';
        const isPrediction = accessedFromSemester2Direct ? "" : "المتوقعة ";
        result.textContent = `النسبة الإجمالية ${isPrediction}للمجموع النهائي هي: ${finalPercentage}%`;
    }
});
